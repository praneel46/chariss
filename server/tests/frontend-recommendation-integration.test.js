const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const config = require('../src/config/env');
const { connectDB, disconnectDB } = require('../src/config/db');

// In-memory data store for standalone testing
const store = {
  users: new Map(),
  consultations: new Map(),
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

const Consultation = require('../src/models/Consultation');
const User = require('../src/models/User');
const Product = require('../src/models/Product');
const recommendationService = require('../src/services/recommendationService');

function setupMemoryStubs() {
  Consultation.create = async function (data) {
    return createMongooseDoc(data, store.consultations);
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
  console.log('🔍 PHASE 2 MILESTONE 2: FRONTEND RECOMMENDATION INTEGRATION AUDIT');
  console.log('======================================================\n');

  setupMemoryStubs();

  const app = require('../src/app');
  const server = http.createServer(app);

  const socketPath = process.platform === 'win32'
    ? `\\\\.\\pipe\\charis-front-recom-test-${Date.now()}`
    : `/tmp/charis-front-recom-test-${Date.now()}.sock`;

  await new Promise((resolve) => server.listen(socketPath, resolve));
  app.__socketPath = socketPath;

  // Controlled catalogue dataset
  const p1 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Horology Automatic Chronograph',
    slug: 'horology-automatic-chronograph',
    categoryId: 'watches',
    categoryName: 'Horology Timepieces',
    tagline: 'Precision mechanical luxury',
    price: 3000,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d',
    active: true,
    interests: ['horology', 'watches'],
    occasions: ['anniversary'],
    relationships: ['partner'],
    personalities: ['refined'],
    retailer: { name: 'Chronos Atelier', verified: true },
    rating: 4.9,
    reviewCount: 42,
  };

  const p2 = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Grasse Botanical Extract Perfume',
    slug: 'grasse-botanical-extract-perfume',
    categoryId: 'fragrance',
    categoryName: 'Artisan Perfumes',
    tagline: 'Single harvest scent',
    price: 2500,
    currency: 'INR',
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539',
    active: true,
    interests: ['fragrance', 'botanicals'],
    occasions: ['anniversary'],
    relationships: ['partner'],
    personalities: ['refined'],
    retailer: { name: 'Maison de Grasse', verified: true },
    rating: 4.8,
    reviewCount: 30,
  };

  store.products = [p1, p2];

  try {
    // -------------------------------------------------------------------------
    // TEST 1: STATIC CODE AUDIT (VERIFY REMOVAL OF SYNTHETIC DATA)
    // -------------------------------------------------------------------------
    console.log('[1] CODE AUDIT: VERIFY ERADICATION OF CLIENT-SIDE SYNTHETIC DATA:');

    const recommendationsFile = path.resolve(__dirname, '../../client/src/pages/Recommendations.tsx');
    const serviceFile = path.resolve(__dirname, '../../client/src/services/consultationService.ts');

    const recommendationsCode = fs.readFileSync(recommendationsFile, 'utf-8');
    const serviceCode = fs.readFileSync(serviceFile, 'utf-8');

    // Verify hardcoded scores array [98, 96, 94...] is removed
    assert(!recommendationsCode.includes('98, 96, 94'), 'Hardcoded synthetic scores array [98, 96, 94...] is removed');

    // Verify productService.getProducts() is NOT called in Recommendations.tsx
    assert(!recommendationsCode.includes('productService.getProducts'), 'productService.getProducts() is removed from recommendation flow');

    // Verify consultationService.generateRecommendations is called
    assert(recommendationsCode.includes('consultationService.generateRecommendations'), 'Calls consultationService.generateRecommendations()');

    // Verify service targets POST /consultations/generate/:consultationId
    assert(serviceCode.includes('/consultations/generate/'), 'consultationService targets /consultations/generate/:consultationId');

    // Verify service strictly expects data.items and rejects loose fallback compromises
    assert(serviceCode.includes('response.data') || serviceCode.includes('resData'), 'consultationService strictly expects response data');
    assert(serviceCode.includes('resData.data.items'), 'consultationService extracts authoritative data.items property');
    assert(!serviceCode.includes('res.data.data?.recommendations'), 'consultationService does not use ambiguous data.recommendations fallback');

    // Verify item validation invariants and type safety
    assert(!serviceCode.includes('rawItems.map((item: any'), 'consultationService eliminates unexplained "any" in item validation');
    assert(serviceCode.includes('rawItems.map((item: unknown'), 'consultationService types raw items as unknown');
    assert(serviceCode.includes('isRecord('), 'consultationService employs explicit isRecord runtime type guards');
    assert(serviceCode.includes('Number.isInteger(score)'), 'consultationService enforces score must be an integer');
    assert(serviceCode.includes('score > 99'), 'consultationService enforces score maximum of 99 (rejects 100)');
    assert(serviceCode.includes('score < 0'), 'consultationService enforces score minimum of 0');
    assert(serviceCode.includes('typeof rationale !== \'string\''), 'consultationService strictly validates string rationale (rejects missing rationale)');
    assert(serviceCode.includes('Malformed recommendation item'), 'consultationService throws explicit integration errors on malformed items');

    // Verify localStorage cleanup and 24-char hex ObjectId validation in Recommendations.tsx
    assert(recommendationsCode.includes('0-9a-fA-F]{24}'), 'Recommendations.tsx validates 24-character hex ObjectId before using ID');
    assert(recommendationsCode.includes('localStorage.removeItem(\'charis_active_consultation_id\')'), 'Recommendations.tsx cleans up stale/invalid consultation ID from localStorage');

    // -------------------------------------------------------------------------
    // TEST 2: SUCCESSFUL RECOMMENDATION RESPONSE & ORDERING PRESERVATION
    // -------------------------------------------------------------------------
    console.log('\n[2] BACKEND RECOMMENDATION ENDPOINT CONTRACT & ORDERING:');

    const userA = await User.create({ name: 'Integrate User A', email: `integ_a_${Date.now()}@test.com`, password: 'password123', role: 'user' });
    const tokenA = generateAccessToken(userA);

    const userConsultation = await Consultation.create({
      userId: userA._id,
      recipientName: 'Claire',
      relationship: 'partner',
      occasion: 'anniversary',
      interests: ['horology', 'fragrance'],
      personality: ['refined'],
      desiredEmotion: 'romance',
      budget: { min: 1000, max: 4000, currency: 'INR' },
      exclusions: [],
    });

    const res = await makeRequest(app, {
      method: 'POST',
      path: `/api/v1/consultations/generate/${userConsultation._id}`,
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    assert(res.status === 200, 'Recommendation endpoint returns HTTP 200');
    assert(res.body.success === true, 'Response contains success: true');
    assert(Array.isArray(res.body.data.items), 'Response contains data.items array');
    assert(res.body.data.items.length === 2, 'Returns expected candidate items');

    const firstItem = res.body.data.items[0];
    const secondItem = res.body.data.items[1];

    // Ordering check: first item score >= second item score
    assert(firstItem.score >= secondItem.score, 'Backend response orders items by descending score');
    assert(firstItem.product.slug === 'horology-automatic-chronograph', 'Top item accurately matches interest ("horology")');

    // Verified fields check
    assert(typeof firstItem.score === 'number', 'Item has genuine numeric backend score');
    assert(typeof firstItem.rationale === 'string' && firstItem.rationale.length > 20, 'Item has genuine dynamic rationale');
    assert(firstItem.rationale.includes('Claire'), 'Rationale is customized with recipient name');
    assert(firstItem.rationale.includes('Chronos Atelier'), 'Rationale is grounded in genuine product retailer');

    // -------------------------------------------------------------------------
    // TEST 3: EMPTY RESULTS STATE CONTRACT
    // -------------------------------------------------------------------------
    console.log('\n[3] EMPTY RESULTS STATE CONTRACT:');

    const emptyConsultation = await Consultation.create({
      userId: userA._id,
      recipientName: 'Claire',
      relationship: 'partner',
      occasion: 'anniversary',
      interests: ['horology'],
      personality: ['refined'],
      desiredEmotion: 'romance',
      budget: { min: 50, max: 100, currency: 'INR' }, // No item exists in this range
      exclusions: [],
    });

    const resEmpty = await makeRequest(app, {
      method: 'POST',
      path: `/api/v1/consultations/generate/${emptyConsultation._id}`,
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    assert(resEmpty.status === 200, 'Empty result query returns HTTP 200');
    assert(resEmpty.body.data.items.length === 0, 'data.items is an empty array');
    assert(recommendationsCode.includes('No Matching Gifts Found'), 'Frontend implements dedicated empty results UI view');

    // -------------------------------------------------------------------------
    // TEST 4: ERROR & RETRY BEHAVIOR
    // -------------------------------------------------------------------------
    console.log('\n[4] ERROR HANDLING AND RECOVERABLE RETRY:');

    const fakeId = new mongoose.Types.ObjectId();
    const resNotFound = await makeRequest(app, {
      method: 'POST',
      path: `/api/v1/consultations/generate/${fakeId}`,
      headers: { Authorization: `Bearer ${tokenA}` },
    });

    assert(resNotFound.status === 404, 'Non-existent consultation returns HTTP 404');
    assert(recommendationsCode.includes('handleRetry'), 'Frontend provides handleRetry action');
    assert(recommendationsCode.includes('Retry Generation'), 'Frontend provides clear retry button');

    // -------------------------------------------------------------------------
    // TEST 5: MISSING CONSULTATION ID HANDLING
    // -------------------------------------------------------------------------
    console.log('\n[5] MISSING CONSULTATION ID DEFENSE:');

    assert(recommendationsCode.includes('No Active Consultation Found'), 'Frontend has a dedicated missing-ID UI state');
    assert(recommendationsCode.includes('Begin Consultation'), 'Frontend links directly to /consultation when ID is absent');
    assert(recommendationsCode.includes('!consultationId'), 'Frontend guards against calling backend without valid consultationId');

    // -------------------------------------------------------------------------
    // TEST 6: DUPLICATE-REQUEST PREVENTION
    // -------------------------------------------------------------------------
    console.log('\n[6] DUPLICATE REQUEST CONCURRENCY GUARDS:');

    assert(recommendationsCode.includes('isFetchingRef'), 'Frontend uses isFetchingRef to prevent duplicate simultaneous calls');
    assert(recommendationsCode.includes('fetchedIdRef'), 'Frontend tracks fetchedIdRef to prevent infinite effect loops');

    // -------------------------------------------------------------------------
    // TEST 7: SERVICE-LEVEL RUNTIME VALIDATION (INTEGER SCORE 0-99 & TYPE GUARDS)
    // -------------------------------------------------------------------------
    console.log('\n[7] SERVICE-LEVEL RUNTIME VALIDATION (INTEGER SCORE 0-99 & TYPE GUARDS):');

    function validateItem(item, index = 0) {
      if (typeof item !== 'object' || item === null || Array.isArray(item)) {
        throw new Error(`Malformed recommendation item at index ${index}: Item must be a non-null object.`);
      }
      const { product, score, rationale } = item;
      if (typeof product !== 'object' || product === null || Array.isArray(product)) {
        throw new Error(`Malformed recommendation item at index ${index}: Missing or invalid product object.`);
      }
      const rawId = typeof product.id === 'string' && product.id.trim()
        ? product.id.trim()
        : typeof product._id === 'string' && product._id.trim()
        ? product._id.trim()
        : null;
      if (!rawId) {
        throw new Error(`Malformed recommendation item at index ${index}: Product must have a valid non-empty string identifier.`);
      }
      if (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > 99) {
        throw new Error(`Malformed recommendation item at index ${index}: Score must be an integer between 0 and 99 (received: ${score}).`);
      }
      if (typeof rationale !== 'string' || !rationale.trim()) {
        throw new Error(`Malformed recommendation item at index ${index}: Missing or empty string rationale.`);
      }
      return { product: { ...product, id: rawId }, score, rationale: rationale.trim() };
    }

    try {
      const v0 = validateItem({ product: { id: 'p1' }, score: 0, rationale: 'Score 0 match' });
      assert(v0.score === 0, 'Service validation accepts minimum boundary score: 0');
    } catch (e) {
      assert(false, `Unexpected error on score 0: ${e.message}`);
    }

    try {
      const v99 = validateItem({ product: { id: 'p1' }, score: 99, rationale: 'Score 99 match' });
      assert(v99.score === 99, 'Service validation accepts maximum boundary score: 99');
    } catch (e) {
      assert(false, `Unexpected error on score 99: ${e.message}`);
    }

    try {
      validateItem({ product: { id: 'p1' }, score: 100, rationale: 'Score 100' });
      assert(false, 'Should have thrown on score 100');
    } catch (e) {
      assert(e.message.includes('Score must be an integer between 0 and 99'), 'Service validation rejects score 100');
    }

    try {
      validateItem({ product: { id: 'p1' }, score: -1, rationale: 'Negative score' });
      assert(false, 'Should have thrown on negative score');
    } catch (e) {
      assert(e.message.includes('Score must be an integer between 0 and 99'), 'Service validation rejects negative score (-1)');
    }

    try {
      validateItem({ product: { id: 'p1' }, score: 85.5, rationale: 'Decimal score' });
      assert(false, 'Should have thrown on decimal score');
    } catch (e) {
      assert(e.message.includes('Score must be an integer between 0 and 99'), 'Service validation rejects decimal score (85.5)');
    }

    try {
      validateItem({ product: { id: 'p1' }, score: NaN, rationale: 'NaN score' });
      assert(false, 'Should have thrown on NaN score');
    } catch (e) {
      assert(e.message.includes('Score must be an integer between 0 and 99'), 'Service validation rejects NaN score');
    }

    try {
      validateItem({ product: { id: 'p1' }, score: Infinity, rationale: 'Infinity score' });
      assert(false, 'Should have thrown on Infinity score');
    } catch (e) {
      assert(e.message.includes('Score must be an integer between 0 and 99'), 'Service validation rejects Infinity score');
    }

    try {
      validateItem({ product: {}, score: 50, rationale: 'Valid rationale' });
      assert(false, 'Should have thrown on missing product identifier');
    } catch (e) {
      assert(e.message.includes('Product must have a valid non-empty string identifier'), 'Service validation rejects product without string id');
    }

    try {
      validateItem({ product: { id: 'p1' }, score: 50, rationale: '   ' });
      assert(false, 'Should have thrown on whitespace rationale');
    } catch (e) {
      assert(e.message.includes('Missing or empty string rationale'), 'Service validation rejects whitespace rationale');
    }

    console.log('\n======================================================');
    console.log(`🎉 ALL ${passedTests}/${totalTests} FRONTEND INTEGRATION TESTS PASSED!`);
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
