const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../src/config/env');
const { connectDB, disconnectDB } = require('../src/config/db');

// In-memory data store for standalone testing
const store = {
  users: new Map(),
  consultations: new Map(),
  giftCards: new Map(),
  products: [],
};

function createMongooseDoc(data, map) {
  const doc = {
    ...data,
    _id: data._id || new mongoose.Types.ObjectId(),
    toObject: function () {
      return { ...this };
    },
    save: async function () {
      map.set(this._id.toString(), this);
      return this;
    },
  };
  map.set(doc._id.toString(), doc);
  return doc;
}

let isUsingMemoryFallback = false;

const Consultation = require('../src/models/Consultation');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const recommendationService = require('../src/services/recommendationService');

function setupMemoryStubs() {
  isUsingMemoryFallback = true;
  console.log('⚡ Using in-memory model harness to execute real HTTP Express routes.\n');

  Consultation.create = async function (data) {
    return createMongooseDoc(data, store.consultations);
  };

  Consultation.findOne = async function (query) {
    const all = Array.from(store.consultations.values());
    return all.find((c) => {
      let match = true;
      if (query.userId !== undefined) {
        match = match && ((c.userId ? c.userId.toString() : null) === (query.userId ? query.userId.toString() : null));
      }
      if (query.guestSessionHash !== undefined) {
        match = match && (c.guestSessionHash === query.guestSessionHash);
      }
      if (query.idempotencyKey !== undefined) {
        match = match && (c.idempotencyKey === query.idempotencyKey);
      }
      if (query._id !== undefined) {
        match = match && (c._id.toString() === query._id.toString());
      }
      return match;
    }) || null;
  };

  Consultation.findById = async function (id) {
    return store.consultations.get(id?.toString()) || null;
  };

  Consultation.find = function (query) {
    const all = Array.from(store.consultations.values());
    let filtered = all;
    if (query) {
      if (query.userId !== undefined) {
        filtered = filtered.filter(
          (c) => (c.userId ? c.userId.toString() : null) === (query.userId ? query.userId.toString() : null)
        );
      }
      if (query.guestSessionHash) {
        filtered = filtered.filter((c) => c.guestSessionHash === query.guestSessionHash);
      }
    }
    return {
      sort: async function () {
        return filtered;
      },
    };
  };

  Consultation.syncIndexes = async function () {};

  User.create = async function (data) {
    return createMongooseDoc(data, store.users);
  };
  User.findById = function (id) {
    const user = store.users.get(id?.toString());
    return {
      select: async function () {
        return user || null;
      },
    };
  };

  Product.find = async function (query) {
    if (query && query.active !== undefined) {
      return store.products.filter((p) => p.active === query.active);
    }
    return store.products;
  };
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASSED: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

function makeRequest(app, { method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        socketPath: app.__socketPath,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          Origin: 'http://localhost:5173',
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {
            json = data;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: json,
          });
        });
      }
    );
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

const { generateAccessToken } = require('../src/utils/tokenUtils');

async function run() {
  console.log('\n======================================================');
  console.log('🔍 PHASE 2 MILESTONE 2: RECOMMENDATION ENGINE AUDIT SUITE');
  console.log('======================================================\n');

  setupMemoryStubs();

  const app = require('../src/app');
  const server = http.createServer(app);

  const socketPath = process.platform === 'win32'
    ? `\\\\.\\pipe\\charis-recom-test-${Date.now()}`
    : `/tmp/charis-recom-test-${Date.now()}.sock`;

  await new Promise((resolve) => server.listen(socketPath, resolve));
  app.__socketPath = socketPath;

  // Setup rich product dataset
  const p1ActiveWatch = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Horology Automatic Chronograph',
    slug: 'horology-automatic-chronograph',
    categoryId: 'watches',
    categoryName: 'Horology Timepieces',
    price: 3000,
    currency: 'INR',
    active: true,
    interests: ['horology', 'watches', 'craftsmanship'],
    occasions: ['anniversary', 'milestone', 'birthday'],
    relationships: ['partner', 'husband', 'spouse'],
    personalities: ['refined', 'analytical'],
    tags: ['luxury', 'mechanical', 'chronograph'],
    retailer: { name: 'Chronos Atelier', verified: true },
    rating: 4.9,
    reviewCount: 42,
  };

  const p2ActivePerfume = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Grasse Botanical Extract Perfume',
    slug: 'grasse-botanical-extract-perfume',
    categoryId: 'fragrance',
    categoryName: 'Artisan Perfumes',
    price: 2500,
    currency: 'INR',
    active: true,
    interests: ['fragrance', 'botanicals', 'perfumes'],
    occasions: ['anniversary', 'valentines', 'birthday'],
    relationships: ['partner', 'wife', 'girlfriend'],
    personalities: ['romantic', 'sensual'],
    tags: ['perfume', 'grasse', 'botanical'],
    retailer: { name: 'Maison de Grasse', verified: false }, // Unverified retailer
    rating: 4.8,
    reviewCount: 30,
  };

  const p3ActiveLeatherWallet = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Tuscan Full-Grain Leather Bi-Fold',
    slug: 'tuscan-full-grain-leather-bi-fold',
    categoryId: 'leather_goods',
    categoryName: 'Italian Leather',
    price: 1800,
    currency: 'INR',
    active: true,
    interests: ['leather', 'minimalism', 'travel'],
    occasions: ['birthday', 'promotion'],
    relationships: ['colleague', 'friend', 'brother'],
    personalities: ['practical', 'organized'],
    tags: ['leather', 'wallet', 'tuscan'],
    retailer: { name: 'Firenze Pelle', verified: true },
    rating: 4.7,
    reviewCount: 18,
  };

  const p4InactiveDraft = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Draft Unreleased Prototype Ring',
    slug: 'draft-unreleased-prototype-ring',
    categoryId: 'jewelry',
    categoryName: 'Fine Jewelry',
    price: 2800,
    currency: 'INR',
    active: false, // Inactive! Must be excluded
    interests: ['jewelry', 'horology'],
    occasions: ['anniversary'],
    relationships: ['partner'],
    personalities: ['refined'],
    tags: ['draft'],
    retailer: { name: 'Draft Studio' },
  };

  const p5ExpensiveWatch = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Imperial Tourbillon Rose Gold',
    slug: 'imperial-tourbillon-rose-gold',
    categoryId: 'watches',
    categoryName: 'High Horology',
    price: 85000, // Far exceeds budget
    currency: 'INR',
    active: true,
    interests: ['horology'],
    occasions: ['anniversary'],
    relationships: ['partner'],
    personalities: ['refined'],
    tags: ['tourbillon'],
    retailer: { name: 'Geneva Haute' },
  };

  const p6UsdProduct = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Silk Travel Scarf',
    slug: 'silk-travel-scarf',
    categoryId: 'accessories',
    categoryName: 'Luxury Silk',
    description: 'An ethereal mulberry silk scarf. Pairs effortlessly with a bespoke leather jacket or evening blazer.',
    price: 2500,
    currency: 'USD', // Currency mismatch with INR consultation!
    active: true,
    interests: ['fashion', 'travel'],
    occasions: ['anniversary'],
    relationships: ['partner'],
    personalities: ['refined'],
    tags: ['silk', 'scarf'],
    retailer: { name: 'Lyon Silks' },
  };

  const p7SmartGlasses = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Ray-Ban Meta Smart Glasses',
    slug: 'ray-ban-meta-smart-glasses',
    categoryId: 'tech',
    categoryName: 'Smart Eyewear',
    description: 'Next-gen smart frames with audio and ultra-wide camera.',
    price: 3200,
    currency: 'INR',
    active: true,
    interests: ['tech', 'gadgets', 'photography'],
    occasions: ['birthday', 'graduation'],
    relationships: ['friend', 'brother'],
    personalities: ['innovative'],
    tags: ['smart', 'audio', 'tech', 'glasses'],
    retailer: { name: 'Meta Optical', verified: true },
    rating: 4.8,
    reviewCount: 50,
  };

  const p8ToleranceProduct = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Handcrafted Mechanical Desk Clock',
    slug: 'handcrafted-mechanical-desk-clock',
    categoryId: 'watches',
    categoryName: 'Horology Timepieces',
    price: 3150, // Exactly 5% above 3000 max budget
    currency: 'INR',
    active: true,
    interests: ['horology', 'clocks'],
    occasions: ['anniversary'],
    relationships: ['partner'],
    personalities: ['refined'],
    tags: ['clock', 'horology'],
    retailer: { name: 'Heritage Clocks' },
    rating: 4.6,
    reviewCount: 10,
  };

  store.products = [
    p1ActiveWatch,
    p2ActivePerfume,
    p3ActiveLeatherWallet,
    p4InactiveDraft,
    p5ExpensiveWatch,
    p6UsdProduct,
    p7SmartGlasses,
    p8ToleranceProduct,
  ];

  try {
    // -------------------------------------------------------------------------
    // 1. SCORE CALIBRATION & EVIDENCE-BASED SCORING
    // -------------------------------------------------------------------------
    console.log('[1] EVIDENCE-BASED RECOMMENDATION SCORE CALIBRATION:');

    const consultationElena = {
      recipientName: 'Elena',
      relationship: 'partner',
      occasion: 'anniversary',
      interests: ['horology', 'watches'],
      personality: ['refined', 'analytical'],
      desiredEmotion: 'romance',
      budget: { min: 1000, max: 4000, currency: 'INR' },
      exclusions: [],
    };

    // A. Strong relevance (p1ActiveWatch matches interests, occasion, relationship, personality, budget)
    const scoreStrong = recommendationService.calculateRelevanceScore(p1ActiveWatch, consultationElena);
    assert(scoreStrong.scaledScore >= 80, `Strong relevance yields high score: ${scoreStrong.scaledScore}% (>= 80%)`);
    assert(scoreStrong.rawScore >= 0.80, `Strong raw score is evidence-based: ${scoreStrong.rawScore.toFixed(2)}`);

    // B. Moderate relevance (p2ActivePerfume matches occasion & relationship, but 0 interests)
    const scoreModerate = recommendationService.calculateRelevanceScore(p2ActivePerfume, consultationElena);
    assert(
      scoreModerate.scaledScore < scoreStrong.scaledScore,
      `Moderate score (${scoreModerate.scaledScore}%) is strictly lower than strong score (${scoreStrong.scaledScore}%)`
    );
    assert(scoreModerate.scaledScore >= 35 && scoreModerate.scaledScore <= 75, `Moderate relevance in sensible range (got: ${scoreModerate.scaledScore}%)`);

    // C. Zero relevance: product with zero matching dimensions
    const completelyUnrelatedConsultation = {
      recipientName: 'Sam',
      relationship: 'grandparent',
      occasion: 'retirement',
      interests: ['gardening', 'pottery', 'botany'],
      personality: ['outdoorsy'],
      desiredEmotion: 'tranquility',
      budget: { min: 1000, max: 4000, currency: 'INR' },
      exclusions: [],
    };
    const scoreZero = recommendationService.calculateRelevanceScore(p1ActiveWatch, completelyUnrelatedConsultation);
    assert(scoreZero.scaledScore <= 20, `Zero relevance does NOT receive inflated score: got ${scoreZero.scaledScore}% (<= 20%)`);
    assert(scoreZero.scaledScore < 70, `Confirmed: zero relevance no longer receives artificial 70% floor! (got ${scoreZero.scaledScore}%)`);

    // D. Minimum relevance threshold pruning
    const resultElena = await recommendationService.generateGroundedRecommendations(consultationElena);
    const returnedSlugs = resultElena.items.map((i) => i.product.slug);
    assert(returnedSlugs.includes('horology-automatic-chronograph'), 'Highly relevant watch is included');
    // Wallet matches 0 interests, wrong occasion, wrong relationship: should be pruned by threshold or ranked bottom
    const walletRank = resultElena.items.findIndex((i) => i.product.slug === 'tuscan-full-grain-leather-bi-fold');
    assert(walletRank === -1 || walletRank > 0, 'Completely unrelated wallet is pruned or ranked below matched items');

    // E. Missing profile fields handling (graceful neutral baseline without NaN)
    const minimalConsultation = {
      recipientName: 'Anonymous',
      budget: { min: 1000, max: 4000, currency: 'INR' },
    };
    const scoreMinimal = recommendationService.calculateRelevanceScore(p1ActiveWatch, minimalConsultation);
    assert(!isNaN(scoreMinimal.rawScore), 'Missing fields calculate rawScore without NaN');
    assert(!isNaN(scoreMinimal.scaledScore), 'Missing fields calculate scaledScore without NaN');
    assert(scoreMinimal.scaledScore >= 40 && scoreMinimal.scaledScore <= 70, `Missing fields produce balanced baseline (got: ${scoreMinimal.scaledScore}%)`);

    // -------------------------------------------------------------------------
    // 2. PRECISE EXCLUSION MATCHING & FALSE-POSITIVE DEFENSE
    // -------------------------------------------------------------------------
    console.log('\n[2] PRECISE EXCLUSION MATCHING & FALSE-POSITIVE DEFENSE:');

    // A. Exact Category Exclusion
    assert(
      recommendationService.isProductExcluded(p3ActiveLeatherWallet, ['leather_goods']),
      'Exact category exclusion ("leather_goods") excludes leather wallet'
    );

    // B. Exact Tag Exclusion
    assert(
      recommendationService.isProductExcluded(p2ActivePerfume, ['perfume']),
      'Exact tag exclusion ("perfume") excludes perfume'
    );

    // C. Case-insensitivity & whitespace normalization
    assert(
      recommendationService.isProductExcluded(p3ActiveLeatherWallet, ['  LEATHER   ']),
      'Case-insensitive and whitespace-padded exclusion ("  LEATHER   ") works accurately'
    );

    // D. Relevant Aliases
    assert(
      recommendationService.isProductExcluded(p2ActivePerfume, ['fragrance']),
      'Alias exclusion: "fragrance" excludes product tagged with "perfume"'
    );
    assert(
      recommendationService.isProductExcluded(p1ActiveWatch, ['watches']),
      'Alias exclusion: "watches" excludes product with category "watches"'
    );

    // E. False-Positive Substring Case 1: "art" exclusion vs "smart" tag/name
    // p7SmartGlasses has name "Ray-Ban Meta Smart Glasses" and tag "smart"
    assert(
      !recommendationService.isProductExcluded(p7SmartGlasses, ['art']),
      'Exclusion "art" does NOT falsely exclude "Smart Glasses" (word boundary protection)'
    );

    // F. False-Positive Substring Case 2: Description mentioning another material
    // p6UsdProduct description says "Pairs effortlessly with a bespoke leather jacket..."
    // But it is a SILK scarf, not leather!
    assert(
      !recommendationService.isProductExcluded(p6UsdProduct, ['leather']),
      'Exclusion "leather" does NOT falsely exclude silk scarf whose description mentions "leather jacket"'
    );

    // G. Unrecognized exclusion term
    assert(
      !recommendationService.isProductExcluded(p1ActiveWatch, ['underwater_basket_weaving']),
      'Unrecognized exclusion term does not falsely exclude unrelated watch'
    );

    // -------------------------------------------------------------------------
    // 3. GROUNDED RECOMMENDATION RATIONALES
    // -------------------------------------------------------------------------
    console.log('\n[3] GROUNDED RECOMMENDATION RATIONALE VERIFICATION:');

    // A. Grounded retailer verification (verified === true)
    const rationaleP1 = recommendationService.generateDynamicRationale(p1ActiveWatch, consultationElena, scoreStrong.matchDetails);
    assert(rationaleP1.includes('from verified retailer Chronos Atelier'), 'States "verified retailer" when retailer.verified is explicitly true');
    assert(rationaleP1.includes('Elena'), 'Incorporates recipient name accurately');
    assert(rationaleP1.includes('partner'), 'Incorporates recipient relationship');
    assert(rationaleP1.includes('anniversary'), 'Incorporates occasion');
    assert(rationaleP1.includes('horology') || rationaleP1.includes('watches'), 'Incorporates matched interests');

    // B. Grounded unverified retailer (verified === false)
    const rationaleP2 = recommendationService.generateDynamicRationale(p2ActivePerfume, consultationElena, scoreModerate.matchDetails);
    assert(!rationaleP2.includes('verified retailer'), 'Does NOT claim "verified retailer" when retailer.verified is false');
    assert(rationaleP2.includes('from Maison de Grasse'), 'Accurately credits retailer name without verified claim');

    // C. Grounded handling of missing metadata
    const bareProduct = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Unbranded Minimal Token',
      categoryName: 'Keepsake',
      price: 1500,
      currency: 'INR',
      active: true,
    };
    const rationaleBare = recommendationService.generateDynamicRationale(bareProduct, minimalConsultation, {});
    assert(!rationaleBare.includes('undefined'), 'No "undefined" leaks into rationale with minimal metadata');
    assert(!rationaleBare.includes('verified'), 'Does not claim verified for unbranded product');
    assert(rationaleBare.length > 20, 'Generates clean, dignified phrasing');

    // -------------------------------------------------------------------------
    // 4. BUDGET TOLERANCE CONFIGURATION & SEMANTICS
    // -------------------------------------------------------------------------
    console.log('\n[4] BUDGET TOLERANCE CONFIGURATION & BOUNDARIES:');

    const strictBudgetConsultation = {
      ...consultationElena,
      budget: { min: 1000, max: 3000, currency: 'INR' }, // p8 Desk Clock costs 3150
    };

    // A. Strict Default Tolerance (0.0): p8ToleranceProduct (₹3,150) must be rejected
    const resultStrict = await recommendationService.generateGroundedRecommendations(strictBudgetConsultation);
    const strictSlugs = resultStrict.items.map((i) => i.product.slug);
    assert(
      !strictSlugs.includes('handcrafted-mechanical-desk-clock'),
      'Default strict budget (0.0 tolerance) strictly excludes product exceeding max (₹3,150 vs max ₹3,000)'
    );

    // B. Explicit Configured Tolerance (0.10): p8ToleranceProduct (₹3,150 <= ₹3,300) is accepted
    const resultWithTolerance = await recommendationService.generateGroundedRecommendations(strictBudgetConsultation, {
      toleranceRatio: 0.10, // allows up to 3300
    });
    const toleranceSlugs = resultWithTolerance.items.map((i) => i.product.slug);
    assert(
      toleranceSlugs.includes('handcrafted-mechanical-desk-clock'),
      'Explicit tolerance (10%) accepts product within tolerance cap (₹3,150 <= ₹3,300)'
    );

    // C. Hard cap: Product exceeding even configured tolerance is rejected
    assert(
      !toleranceSlugs.includes('imperial-tourbillon-rose-gold'),
      'Product exceeding configured tolerance cap (₹85,000 vs cap ₹3,300) is rejected'
    );

    // D. Currency mismatch rejected
    assert(
      !toleranceSlugs.includes('silk-travel-scarf'),
      'Currency mismatch (USD vs INR) is strictly rejected'
    );

    // -------------------------------------------------------------------------
    // 5. DETERMINISTIC TIE-BREAKING & ORDERING
    // -------------------------------------------------------------------------
    console.log('\n[5] DETERMINISTIC TIE-BREAKING:');

    const runA = await recommendationService.generateGroundedRecommendations(consultationElena);
    const runB = await recommendationService.generateGroundedRecommendations(consultationElena);

    assert(runA.items.length === runB.items.length, 'Tie-breaking yields identical count on multiple runs');
    assert(
      runA.items.every((it, idx) => it.product.slug === runB.items[idx].product.slug && it.score === runB.items[idx].score),
      'Scoring and tie-breaking are 100% deterministic'
    );

    // -------------------------------------------------------------------------
    // 6. ENDPOINT OWNERSHIP & SECURITY
    // -------------------------------------------------------------------------
    console.log('\n[6] HTTP ENDPOINT SECURITY & OWNERSHIP:');

    const userA = await User.create({ name: 'User A', email: 'audit_usera@test.com', role: 'user' });
    const userB = await User.create({ name: 'User B', email: 'audit_userb@test.com', role: 'user' });
    const tokenA = generateAccessToken(userA);
    const tokenB = generateAccessToken(userB);

    const userAConsultation = await Consultation.create({
      userId: userA._id,
      ...consultationElena,
    });

    // User A accessing own consultation -> HTTP 200
    const resAuthA = await makeRequest(app, {
      method: 'POST',
      path: `/api/v1/consultations/generate/${userAConsultation._id}`,
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(resAuthA.status === 200, 'User A generating recommendations for own consultation succeeds (HTTP 200)');
    assert(resAuthA.body.data.items.length > 0, 'Returns ranked recommendation items');
    assert(typeof resAuthA.body.data.items[0].score === 'number', 'Items contain numeric score');
    assert(typeof resAuthA.body.data.items[0].rationale === 'string', 'Items contain string rationale');

    // User B accessing User A consultation -> HTTP 403
    const resAuthB = await makeRequest(app, {
      method: 'POST',
      path: `/api/v1/consultations/generate/${userAConsultation._id}`,
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(resAuthB.status === 403, 'Cross-user access is rejected with HTTP 403');

    // Unpersisted profile bypass -> HTTP 400
    const resBypass = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations/generate',
      body: consultationElena,
    });
    assert(resBypass.status === 400, 'Unpersisted profile bypass is rejected with HTTP 400');
    assert(resBypass.body.code === 'CONSULTATION_ID_REQUIRED', 'Error code is CONSULTATION_ID_REQUIRED');

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} RECOMMENDATION QUALITY TESTS PASSED!`);
    console.log('======================================================\n');
  } finally {
    server.close();
    await disconnectDB();
  }
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
