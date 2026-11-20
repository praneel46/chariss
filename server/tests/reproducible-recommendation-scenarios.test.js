/**
 * CHARIS Scenarios Verification Suite: Reproducible Recommendation Scenarios
 *
 * Scenarios tested against genuine active catalogue products:
 * 1. Mentor / appreciation / Tier 1 (₹500 - ₹1,500)
 * 2. Partner / romance / anniversary / Tier 2 (₹1,500 - ₹3,500)
 * 3. Father / milestone / Tier 3 (₹3,500 - ₹6,500)
 * 4. Judge / formal appreciation / Tier 2 (₹1,500 - ₹3,500)
 * 5. Recipient interested in niche perfume (Any accessible tier)
 * 6. Recipient interested in bespoke keepsakes or maps (Any accessible tier)
 */

const assert = require('assert');
const { SEED_PRODUCTS } = require('../src/data/seedData');
const Product = require('../src/models/Product');
const recommendationService = require('../src/services/recommendationService');

// Stub Product.find to query the validated active seed catalogue
Product.find = async function (query) {
  if (query && query.active === true) {
    return SEED_PRODUCTS.filter((p) => p.active);
  }
  return SEED_PRODUCTS;
};

const SCENARIOS = [
  // Scenario 1: Mentor / appreciation / Tier 1 (₹500 - ₹1,500)
  {
    name: 'Scenario 1: Mentor / appreciation / Tier 1',
    input: {
      recipientName: 'Professor Sen',
      relationship: 'mentor',
      occasion: 'thank_you',
      desiredEmotion: 'appreciation',
      interests: ['fine_writing', 'stationery', 'reading', 'productivity'],
      personality: ['refined', 'introspective', 'methodical'],
      budget: { min: 500, max: 1500, currency: 'INR' },
      productCategories: [],
      exclusions: [],
    },
  },

  // Scenario 2: Partner / romance / anniversary / Tier 2 (₹1,500 - ₹3,500)
  {
    name: 'Scenario 2: Partner / romance / anniversary / Tier 2',
    input: {
      recipientName: 'Ananya',
      relationship: 'partner',
      occasion: 'anniversary',
      desiredEmotion: 'romance',
      interests: ['bespoke_keepsakes', 'perfumes', 'scents'],
      personality: ['sentimental', 'romantic', 'aesthetic'],
      budget: { min: 1500, max: 3500, currency: 'INR' },
      productCategories: [],
      exclusions: [],
    },
  },

  // Scenario 3: Father / milestone / Tier 3 (₹3,500 - ₹6,500)
  {
    name: 'Scenario 3: Father / milestone / Tier 3',
    input: {
      recipientName: 'Kailash',
      relationship: 'father',
      occasion: 'milestone',
      desiredEmotion: 'appreciation',
      interests: ['chess', 'woodcraft', 'luxury', 'tea'],
      personality: ['strategic', 'refined', 'curator'],
      budget: { min: 3500, max: 6500, currency: 'INR' },
      productCategories: [],
      exclusions: [],
    },
  },

  // Scenario 4: Judge / formal appreciation / Tier 2 (₹1,500 - ₹3,500)
  {
    name: 'Scenario 4: Judge / formal appreciation / Tier 2',
    input: {
      recipientName: 'Hon. Justice Verma',
      relationship: 'colleague',
      occasion: 'milestone',
      desiredEmotion: 'appreciation',
      interests: ['fine_writing', 'stationery', 'executive_tools', 'law'],
      personality: ['methodical', 'refined', 'discerning'],
      budget: { min: 1500, max: 3500, currency: 'INR' },
      productCategories: [],
      exclusions: ['alcohol', 'tech_gadgets'],
    },
  },

  // Scenario 5: Recipient interested in niche perfume
  {
    name: 'Scenario 5: Recipient interested in niche perfume',
    input: {
      recipientName: 'Meera',
      relationship: 'someone_special',
      occasion: 'birthday',
      desiredEmotion: 'celebration',
      interests: ['perfumes', 'scents', 'niche_fragrance'],
      personality: ['sensory', 'curator', 'sophisticated'],
      budget: { min: 500, max: 6500, currency: 'INR' },
      productCategories: [],
      exclusions: [],
    },
  },

  // Scenario 6: Recipient interested in bespoke keepsakes or maps
  {
    name: 'Scenario 6: Recipient interested in bespoke keepsakes or maps',
    input: {
      recipientName: 'Rohan & Tara',
      relationship: 'partner',
      occasion: 'wedding',
      desiredEmotion: 'romance',
      interests: ['bespoke_keepsakes', 'astronomy', 'art', 'keepsakes'],
      personality: ['sentimental', 'romantic'],
      budget: { min: 1500, max: 3500, currency: 'INR' },
      productCategories: [],
      exclusions: [],
    },
  },
];

async function runScenarios() {
  console.log('======================================================');
  console.log('🧪 RUNNING REPRODUCIBLE RECOMMENDATION SCENARIOS');
  console.log('======================================================\n');

  const results = [];

  for (const scenario of SCENARIOS) {
    console.log(`------------------------------------------------------`);
    console.log(`📌 ${scenario.name}`);
    console.log(`Input:`, JSON.stringify(scenario.input, null, 2));

    const startTime = Date.now();
    const result = await recommendationService.generateGroundedRecommendations(scenario.input);
    const durationMs = Date.now() - startTime;

    console.log(`Result: ${result.items.length} items returned in ${durationMs}ms:`);
    result.items.forEach((item, idx) => {
      console.log(`  [#${idx + 1}] ${item.product.name} (Score: ${item.score}%, Price: ₹${item.product.price})`);
      console.log(`      Slug: ${item.product.slug}`);
      console.log(`      Category: ${item.product.categoryName} (${item.product.categoryId})`);
      console.log(`      Retailer: ${item.product.retailer.name} (${item.product.retailer.website}) [Verified: ${item.product.retailer.verified}]`);
      console.log(`      Rationale: "${item.rationale}"`);
    });

    results.push({
      scenario: scenario.name,
      input: scenario.input,
      totalActive: result.totalActive,
      eligibleCount: result.eligibleCount,
      returnedCount: result.items.length,
      topItem: result.items[0] || null,
      items: result.items,
    });

    // Verification Invariant: Every scenario MUST return at least 1 grounded candidate
    assert(result.items.length > 0, `Scenario "${scenario.name}" returned zero recommendations!`);
  }

  console.log('\n======================================================');
  console.log('🎉 ALL 6 REPRODUCIBLE SCENARIOS COMPLETED SUCCESSFULLY!');
  console.log('======================================================\n');

  return results;
}

if (require.main === module) {
  runScenarios()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Error executing recommendation scenarios:', err);
      process.exit(1);
    });
}

module.exports = { runScenarios };
