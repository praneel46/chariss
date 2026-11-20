const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const assert = require('assert');
const mongoose = require('mongoose');
const { SEED_PRODUCTS: masterCatalogue } = require('../src/data/seedData');
const Product = require('../src/models/Product');
const recommendationService = require('../src/services/recommendationService');

const {
  isFormalContext,
  isAlcoholProduct,
  isIntimateRomanticKeepsake,
  isPersonalBodyFragrance,
  evaluateContextualSuitability,
  evaluateInterestGate,
  generateDynamicRationale,
  generateGroundedRecommendations,
  SCORING_WEIGHTS,
  DEFAULT_MIN_RELEVANCE_THRESHOLD,
} = recommendationService;

// Setup in-memory mock for Product.find if MongoDB is not connected
let usingMemoryMock = false;
function setupMockProductFind(catalogue) {
  Product.find = async function (filter = {}) {
    if (filter.active === true) {
      return catalogue.filter((p) => p.active === true);
    }
    return catalogue;
  };
  usingMemoryMock = true;
}

let totalTests = 0;
let passedTests = 0;

function runTest(description, testFn) {
  totalTests++;
  try {
    testFn();
    console.log(`  ✓ ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function runAsyncTest(description, testFn) {
  totalTests++;
  try {
    await testFn();
    console.log(`  ✓ ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${description}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function runAllTests() {
  console.log('\n================================================================');
  console.log('CHARIS — Task 2.1: Contextual Suitability & Relevance Guardrails');
  console.log('================================================================\n');

  setupMockProductFind(masterCatalogue);

  // Sample Products for Targeted Unit Assertions
  const whiskeyGlasses = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Glencairn Crystal Whiskey Tasting Glasses Set',
    slug: 'glencairn-whiskey-tasting-glasses',
    categoryName: 'Barware & Spirits',
    categoryId: 'barware',
    tags: ['whiskey', 'scotch', 'barware', 'crystal'],
    interests: ['mixology', 'spirits', 'whiskey'],
    price: 1800,
    currency: 'INR',
    active: true,
  };

  const romanticStarMap = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Sytara Personalized Custom Star Map',
    slug: 'sytara-custom-star-map',
    categoryName: 'Personalized Keepsakes',
    categoryId: 'art_decor',
    tags: ['star map', 'romantic', 'anniversary', 'constellation', 'keepsake', 'love'],
    interests: ['astronomy', 'decor', 'keepsakes'],
    occasions: ['anniversary', 'wedding'],
    relationships: ['partner', 'spouse'],
    price: 1499,
    currency: 'INR',
    active: true,
  };

  const personalPerfume = {
    _id: new mongoose.Types.ObjectId(),
    name: 'ISAK First Rain Discovery Perfume Set (50ml EDP)',
    slug: 'isak-first-rain-discovery-set',
    categoryName: 'Artisan Perfumery',
    categoryId: 'fragrance',
    tags: ['perfume', 'edp', 'scent', 'fragrance', 'personal fragrance'],
    interests: ['fragrance', 'perfumery', 'aromatherapy'],
    price: 1650,
    currency: 'INR',
    active: true,
  };

  const ambientIncense = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Phool Natural Temple Incense Cones Set',
    slug: 'phool-natural-temple-incense',
    categoryName: 'Home Fragrance & Aromatherapy',
    categoryId: 'living_wellness',
    tags: ['incense', 'aromatherapy', 'home fragrance', 'wellness'],
    interests: ['wellness', 'aromatherapy', 'meditation'],
    price: 650,
    currency: 'INR',
    active: true,
  };

  const fountainPen = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Parker Vector Stainless Steel Fountain Pen',
    slug: 'parker-vector-fountain-pen',
    categoryName: 'Writing Instruments',
    categoryId: 'stationery',
    tags: ['pen', 'fountain pen', 'stationery', 'executive'],
    interests: ['literature', 'writing', 'academics', 'stationery'],
    occasions: ['farewell', 'promotion', 'milestone'],
    relationships: ['mentor', 'colleague', 'manager'],
    price: 750,
    currency: 'INR',
    active: true,
    retailer: { name: 'Parker India', verified: true },
  };

  const brassBookmark = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Anand Prakash Handcrafted Brass Peacock Bookmark',
    slug: 'anand-prakash-brass-bookmark',
    categoryName: 'Artisan Reading Accessories',
    categoryId: 'stationery',
    tags: ['bookmark', 'brass', 'handcrafted', 'reading', 'stationery'],
    interests: ['reading', 'literature', 'books', 'art'],
    occasions: ['farewell', 'appreciation', 'milestone'],
    relationships: ['mentor', 'teacher', 'colleague'],
    price: 690,
    currency: 'INR',
    active: true,
    retailer: { name: 'Anand Prakash Atelier', verified: true },
  };

  console.log('Group 1: Formal & Institutional Contextual Classification');
  runTest('Identifies formal recipients (Judge, Mentor, Professor, Client)', () => {
    assert.strictEqual(isFormalContext({ recipientName: 'Judge Harold Vance', relationship: 'mentor' }), true);
    assert.strictEqual(isFormalContext({ recipientName: 'Honorable Justice Roy', relationship: 'colleague' }), true);
    assert.strictEqual(isFormalContext({ recipientName: 'Professor Mehta', relationship: 'teacher' }), true);
    assert.strictEqual(isFormalContext({ recipientName: 'Dr. Evelyn Reed', relationship: 'mentor' }), true);
    assert.strictEqual(isFormalContext({ recipientName: 'Acme Corp Executives', relationship: 'client' }), true);
    assert.strictEqual(isFormalContext({ recipientName: 'Vikram', relationship: 'manager' }), true);
  });

  runTest('Differentiates intimate/personal recipients from formal contexts', () => {
    assert.strictEqual(isFormalContext({ recipientName: 'Elena', relationship: 'partner' }), false);
    assert.strictEqual(isFormalContext({ recipientName: 'Rohit', relationship: 'spouse' }), false);
    assert.strictEqual(isFormalContext({ recipientName: 'Priya (Mom)', relationship: 'mother' }), false);
    assert.strictEqual(isFormalContext({ recipientName: 'Aarav', relationship: 'brother' }), false);
    assert.strictEqual(isFormalContext({ recipientName: 'Ananya', relationship: 'friend' }), false);
  });

  console.log('\nGroup 2: Product Sensitivity Identification');
  runTest('Identifies alcohol-related barware and spirits products', () => {
    assert.strictEqual(isAlcoholProduct(whiskeyGlasses), true);
    assert.strictEqual(isAlcoholProduct(fountainPen), false);
    assert.strictEqual(isAlcoholProduct(romanticStarMap), false);
  });

  runTest('Identifies intimate-romantic keepsakes vs neutral gifts', () => {
    assert.strictEqual(isIntimateRomanticKeepsake(romanticStarMap), true);
    assert.strictEqual(isIntimateRomanticKeepsake(fountainPen), false);
    assert.strictEqual(isIntimateRomanticKeepsake(brassBookmark), false);
  });

  runTest('Identifies personal body fragrance vs neutral home scents', () => {
    assert.strictEqual(isPersonalBodyFragrance(personalPerfume), true);
    assert.strictEqual(isPersonalBodyFragrance(ambientIncense), false);
    assert.strictEqual(isPersonalBodyFragrance(fountainPen), false);
  });

  console.log('\nGroup 3: Contextual Suitability Guardrails');
  runTest('Judge + Alcohol: Disqualified by default in formal context', () => {
    const consultation = {
      recipientName: 'Judge Harold Vance',
      relationship: 'mentor',
      interests: ['law', 'history', 'reading'],
    };
    const suitability = evaluateContextualSuitability(whiskeyGlasses, consultation);
    assert.strictEqual(suitability.suitable, false);
    assert(suitability.reason.includes('Alcohol-related'));
  });

  runTest('Judge + Intimate Romantic Keepsake: Disqualified in formal context', () => {
    const consultation = {
      recipientName: 'Honorable Justice Evelyn Roy',
      relationship: 'mentor',
      interests: ['astronomy', 'reading'],
    };
    const suitability = evaluateContextualSuitability(romanticStarMap, consultation);
    assert.strictEqual(suitability.suitable, false);
    assert(suitability.reason.includes('Intimate romantic keepsake'));
  });

  runTest('Professor + Intimate Keepsake: Disqualified in academic formal context', () => {
    const consultation = {
      recipientName: 'Professor Anand Sharma',
      relationship: 'teacher',
      interests: ['literature', 'reading'],
    };
    const suitability = evaluateContextualSuitability(romanticStarMap, consultation);
    assert.strictEqual(suitability.suitable, false);
    assert(suitability.reason.includes('Intimate romantic keepsake'));
  });

  runTest('Corporate Client + Alcohol: Disqualified by default for corporate relations', () => {
    const consultation = {
      recipientName: 'Apex Advisory Partners',
      relationship: 'client',
      interests: ['finance', 'consulting'],
    };
    const suitability = evaluateContextualSuitability(whiskeyGlasses, consultation);
    assert.strictEqual(suitability.suitable, false);
    assert(suitability.reason.includes('Alcohol-related'));
  });

  runTest('Formal Recipient + Neutral Stationery: Fully eligible', () => {
    const consultation = {
      recipientName: 'Judge Harold Vance',
      relationship: 'mentor',
      interests: ['reading', 'writing'],
    };
    const penCheck = evaluateContextualSuitability(fountainPen, consultation);
    const bookmarkCheck = evaluateContextualSuitability(brassBookmark, consultation);
    assert.strictEqual(penCheck.suitable, true);
    assert.strictEqual(bookmarkCheck.suitable, true);
  });

  console.log('\nGroup 4: Contextual Exceptions & Intent Overrides');
  runTest('Partner / Spouse + Romantic Star Map: Fully eligible', () => {
    const consultation = {
      recipientName: 'Elena',
      relationship: 'partner',
      occasion: 'anniversary',
      interests: ['astronomy', 'keepsakes'],
    };
    const suitability = evaluateContextualSuitability(romanticStarMap, consultation);
    assert.strictEqual(suitability.suitable, true);
  });

  runTest('Explicit User Interest Overrides Alcohol Default for Formal Recipient', () => {
    const consultation = {
      recipientName: 'Professor Mehta',
      relationship: 'colleague',
      interests: ['whiskey tasting', 'mixology', 'cocktails'], // Explicitly requested
    };
    const suitability = evaluateContextualSuitability(whiskeyGlasses, consultation);
    assert.strictEqual(suitability.suitable, true);
  });

  runTest('Explicit Exclusion CANNOT be overridden by explicit interest', () => {
    const consultation = {
      recipientName: 'Professor Mehta',
      relationship: 'colleague',
      interests: ['whiskey tasting'],
      exclusions: ['alcohol'], // Explicit exclusion
    };
    const isExcluded = recommendationService.isProductExcluded(whiskeyGlasses, consultation.exclusions);
    assert.strictEqual(isExcluded, true, 'Product must be hard-excluded by exclusion filter');
  });

  console.log('\nGroup 5: Minimum Relevance Interest Gating');
  runTest('Product with 0 matching interests is pruned when user specified interests', () => {
    const consultation = {
      interests: ['reading', 'literature'],
      productCategories: ['wearables_eyewear', 'curated_boxes'], // Client mock ignored
    };
    const gate = evaluateInterestGate(whiskeyGlasses, consultation, []);
    assert.strictEqual(gate.passed, false);
    assert(gate.reason.includes('zero selected interests'));
  });

  runTest('Product with matching interests passes the interest gate', () => {
    const consultation = {
      interests: ['reading', 'literature'],
    };
    const gate = evaluateInterestGate(brassBookmark, consultation, ['reading', 'literature']);
    assert.strictEqual(gate.passed, true);
    assert(gate.reason.includes('Matched 2 interest(s)'));
  });

  runTest('Consultation with 0 interests falls back gracefully to other dimensions', () => {
    const consultation = {
      interests: [],
      relationship: 'colleague',
      occasion: 'farewell',
    };
    const gate = evaluateInterestGate(brassBookmark, consultation, []);
    assert.strictEqual(gate.passed, true);
    assert(gate.reason.includes('No interests specified'));
  });

  console.log('\nGroup 6: Dynamic Rationale Grounding Quality');
  runTest('Does NOT claim interest matches when 0 interests matched', () => {
    const consultation = {
      recipientName: 'Dr. Aris Thorne',
      relationship: 'mentor',
      occasion: 'retirement',
      desiredEmotion: 'appreciation',
      interests: [],
    };
    const rationale = generateDynamicRationale(brassBookmark, consultation, {
      matchedInterests: [],
      emotionScore: 0.8,
    });
    assert(!rationale.includes('interest in'), 'Must not claim interest match when 0 matched');
    assert(rationale.includes('Dr. Aris Thorne'), 'Includes recipient name');
    assert(rationale.includes('Anand Prakash Atelier'), 'Includes verified retailer');
  });

  runTest('Claims verified retailer ONLY when retailer.verified === true', () => {
    const unverifiedProduct = {
      ...fountainPen,
      retailer: { name: 'Generic Stationers', verified: false },
    };
    const consultation = { recipientName: 'Kavita', relationship: 'friend' };
    const verifiedRationale = generateDynamicRationale(fountainPen, consultation, { matchedInterests: ['stationery'] });
    const unverifiedRationale = generateDynamicRationale(unverifiedProduct, consultation, { matchedInterests: ['stationery'] });

    assert(verifiedRationale.includes('verified retailer Parker India'), 'Verified retailer mentioned with "verified" prefix');
    assert(!unverifiedRationale.includes('verified retailer'), 'Unverified retailer must NOT have "verified" prefix');
    assert(unverifiedRationale.includes('from Generic Stationers'), 'Unverified retailer mentioned plainly');
  });

  runTest('Avoids redundant recipient and relationship duplication', () => {
    const consultation = {
      recipientName: 'Priya (Mom)',
      relationship: 'mother',
      occasion: 'birthday',
    };
    const rationale = generateDynamicRationale(brassBookmark, consultation, { matchedInterests: [] });
    assert(!rationale.includes('Priya (Mom) (mother)'), 'Must not duplicate relationship in brackets');
    assert(rationale.startsWith('Selected for Priya (Mom).'));
  });

  console.log('\nGroup 7: End-to-End Recommendation Engine Scenarios with Real Catalogue');

  await runAsyncTest('Scenario 1 (Professor): Excludes tea/incense, returns purely literature/pens', async () => {
    const consultation = {
      recipientName: 'Professor Sharma',
      relationship: 'mentor',
      occasion: 'farewell',
      personality: 'intellectual',
      interests: ['fine_writing', 'stationery', 'reading', 'productivity'],
      exclusions: ['leather'],
      budget: { min: 500, max: 1500, currency: 'INR' },
    };
    const result = await generateGroundedRecommendations(consultation);
    assert(result.items.length >= 2, 'Must return eligible items');
    const slugs = result.items.map((i) => i.product.slug);
    assert(slugs.includes('parker-vector-gold-rollerball-gift-box'), 'Parker Vector pen recommended');
    assert(slugs.includes('anand-prakash-brass-poetry-bookmark'), 'Anand Prakash bookmark recommended');
    assert(!slugs.includes('phool-natural-incense-floral-gift-box'), 'Phool Incense excluded (zero interest match)');
    assert(!slugs.includes('vahdam-grande-heritage-12-tin-reserve'), 'Tea box excluded (zero interest match)');
  });

  await runAsyncTest('Scenario 2 (Judge Harold): Excludes alcohol, star map, and perfumes; returns only executive pens', async () => {
    const consultation = {
      recipientName: 'Judge Harold Vance',
      relationship: 'mentor',
      occasion: 'milestone',
      personality: 'stoic',
      interests: ['fine_writing', 'stationery', 'executive_tools', 'law'],
      exclusions: [],
      budget: { min: 1500, max: 3500, currency: 'INR' },
    };
    const result = await generateGroundedRecommendations(consultation);
    assert.strictEqual(result.items.length, 1, 'Only genuine high-integrity match returned');
    assert.strictEqual(result.items[0].product.slug, 'parker-im-achromatic-matte-black-pen');
    // Ensure no alcohol or intimate keepsakes slipped through
    const allSlugs = result.items.map((i) => i.product.slug);
    assert(!allSlugs.includes('sytara-custom-framed-star-map'));
    assert(!allSlugs.includes('whiskey-decanter-set'));
  });

  await runAsyncTest('Scenario 3 (Romantic Partner): Star map and romantic gifts are fully eligible', async () => {
    const consultation = {
      recipientName: 'Aanya',
      relationship: 'partner',
      occasion: 'anniversary',
      personality: 'romantic',
      interests: ['bespoke_keepsakes', 'perfumes', 'scents'],
      exclusions: ['leather', 'alcohol'],
      budget: { min: 1500, max: 3500, currency: 'INR' },
    };
    const result = await generateGroundedRecommendations(consultation);
    assert(result.items.length >= 2);
    const slugs = result.items.map((i) => i.product.slug);
    assert(slugs.includes('sytara-custom-framed-star-map'), 'Sytara Star Map included for romantic partner');
    assert(slugs.includes('isak-gift-pack-discovery-perfumes'), 'ISAK perfume included for partner');
  });

  await runAsyncTest('Scoring Weights & Threshold Configuration Preserved', async () => {
    assert.strictEqual(SCORING_WEIGHTS.INTERESTS, 0.35);
    assert.strictEqual(SCORING_WEIGHTS.OCCASION, 0.20);
    assert.strictEqual(SCORING_WEIGHTS.RELATIONSHIP, 0.15);
    assert.strictEqual(SCORING_WEIGHTS.PERSONALITY, 0.10);
    assert.strictEqual(SCORING_WEIGHTS.BUDGET_PROXIMITY, 0.10);
    assert.strictEqual(SCORING_WEIGHTS.CATEGORY_AND_EMOTION, 0.10);
    assert.strictEqual(DEFAULT_MIN_RELEVANCE_THRESHOLD, 0.20);
  });

  console.log('\n================================================================');
  console.log(`Summary: ${passedTests}/${totalTests} tests passed successfully.`);
  console.log('================================================================\n');
}

runAllTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
