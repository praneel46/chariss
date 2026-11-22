const assert = require('assert');
const { generateGroundedRecommendations, calculateRelevanceScore } = require('../src/services/recommendationService');
const { SEED_PRODUCTS } = require('../src/data/seedData');
const Product = require('../src/models/Product');

console.log('================================================================');
console.log('🧪 CHARIS: CATALOGUE QUALITY & EXPANDED SCENARIOS TEST SUITE');
console.log('================================================================\n');

// Mock Product.find to use authoritative SEED_PRODUCTS in-memory
const originalFind = Product.find;
Product.find = function(query) {
  let list = SEED_PRODUCTS.slice();
  if (query && query.active === true) {
    list = list.filter((p) => p.active !== false);
  }
  return {
    lean: () => ({
      exec: () => Promise.resolve(list),
      then: (resolve) => resolve(list),
    }),
    exec: () => Promise.resolve(list),
    then: (resolve) => resolve(list),
  };
};

async function runCatalogueQualityTests() {
  try {
    // -------------------------------------------------------------
    // TEST 1: Catalogue Integrity & Tagging Consistency
    // -------------------------------------------------------------
    console.log('[1] CATALOGUE INTEGRITY & TAGGING CONSISTENCY:');

    assert(SEED_PRODUCTS.length >= 82, `Expected at least 82 products, found ${SEED_PRODUCTS.length}`);

    const slugs = new Set();
    const names = new Set();

    for (const p of SEED_PRODUCTS) {
      assert(p.name && p.name.trim().length > 0, `Product missing name: ${JSON.stringify(p)}`);
      assert(p.slug && p.slug.trim().length > 0, `Product missing slug: ${p.name}`);
      assert(!slugs.has(p.slug), `Duplicate slug detected: ${p.slug}`);
      slugs.add(p.slug);

      assert(!names.has(p.name), `Duplicate name detected: ${p.name}`);
      names.add(p.name);

      assert(typeof p.price === 'number' && p.price > 0, `Invalid price for ${p.slug}: ${p.price}`);
      assert(p.imageUrl && p.imageUrl.startsWith('https://'), `Invalid imageUrl for ${p.slug}: ${p.imageUrl}`);
      assert(p.productUrl && p.productUrl.startsWith('https://'), `Invalid productUrl for ${p.slug}: ${p.productUrl}`);
      assert(p.retailer && p.retailer.name && p.retailer.website, `Missing retailer info for ${p.slug}`);

      // Ensure no category leaks into wrong product domains
      if (p.slug.includes('headphone') || p.slug.includes('earbud') || p.slug.includes('earphone')) {
        assert(
          !p.interests.includes('Fine Horology & Watches'),
          `Headphone product ${p.slug} must not have watch interest`
        );
      }
    }

    console.log(`  ✓ PASSED: All ${SEED_PRODUCTS.length} products pass strict schema, protocol, and cross-domain integrity`);

    // -------------------------------------------------------------
    // TEST 2: Scenario 1 - Formal Professional Mentor
    // -------------------------------------------------------------
    console.log('\n[2] SCENARIO 1: FORMAL PROFESSIONAL MENTOR (STRICT EXCLUSIONS):');
    const mentorProfile = {
      recipientName: 'Dr. Vikram Seth',
      relationship: 'mentor',
      occasion: 'promotion',
      interests: ['fine writing', 'reading', 'productivity'],
      personality: ['refined', 'meticulous', 'organized'],
      desiredEmotion: 'gratitude',
      budget: { min: 1000, max: 15000, currency: 'INR' },
      exclusions: ['alcohol', 'scents', 'leather'],
    };

    const mentorResult = await generateGroundedRecommendations(mentorProfile, { limit: 5 });
    assert(mentorResult.items.length > 0, 'Expected recommendations for mentor scenario');

    for (const it of mentorResult.items) {
      const p = it.product;
      const cat = (p.categoryName || '').toLowerCase();
      const tags = (p.tags || []).join(' ').toLowerCase();
      assert(!cat.includes('barware') && !cat.includes('alcohol'), `Mentor result contains alcohol/barware: ${p.name}`);
      assert(!cat.includes('fragrance') && !cat.includes('scent') && !tags.includes('perfume'), `Mentor result contains scent: ${p.name}`);
      assert(!cat.includes('leather') && !tags.includes('leather'), `Mentor result contains leather: ${p.name}`);
    }
    console.log(`  ✓ PASSED: Formal mentor recommendations strictly respect alcohol, scent, and leather exclusions`);

    // -------------------------------------------------------------
    // TEST 3: Scenario 2 - Audiophile Romantic Partner
    // -------------------------------------------------------------
    console.log('\n[3] SCENARIO 2: AUDIOPHILE ROMANTIC PARTNER:');
    const audiophileProfile = {
      recipientName: 'Elena',
      relationship: 'partner',
      occasion: 'anniversary',
      interests: ['Audiophile Audio & Headphones'],
      personality: ['refined', 'discerning', 'stylish'],
      desiredEmotion: 'romance',
      budget: { min: 20000, max: 70000, currency: 'INR' },
      exclusions: [],
    };

    const audioResult = await generateGroundedRecommendations(audiophileProfile, { limit: 5 });
    assert(audioResult.items.length > 0, 'Expected recommendations for audiophile partner scenario');
    const audioRecs = audioResult.items.filter(
      (it) =>
        (it.product.categoryName || '').includes('Audio') ||
        (it.product.interests || []).includes('audio') ||
        (it.product.interests || []).includes('headphones') ||
        (it.product.interests || []).includes('earpods')
    );
    assert(audioRecs.length >= 3, `Expected at least 3 audio items, got ${audioRecs.length}`);
    console.log(`  ✓ PASSED: Audiophile partner recommendations return high-relevance premium audio pieces`);

    // -------------------------------------------------------------
    // TEST 4: Scenario 3 - Strict Budget Under ₹2,000
    // -------------------------------------------------------------
    console.log('\n[4] SCENARIO 3: STRICT BUDGET (₹500 - ₹2,000):');
    const budgetProfile = {
      recipientName: 'Aarav',
      relationship: 'friend',
      occasion: 'birthday',
      interests: ['reading', 'tea'],
      personality: ['curator', 'mindful'],
      desiredEmotion: 'warmth',
      budget: { min: 500, max: 2000, currency: 'INR' },
      exclusions: [],
    };

    const budgetResult = await generateGroundedRecommendations(budgetProfile, { limit: 5 });
    assert(budgetResult.items.length > 0, 'Expected recommendations within budget');
    for (const it of budgetResult.items) {
      assert(
        it.product.price <= 2000,
        `Item ${it.product.name} costs ₹${it.product.price}, exceeding max budget of ₹2000`
      );
    }
    console.log(`  ✓ PASSED: Strict budget constraint verified (all items <= ₹2000)`);

    // -------------------------------------------------------------
    // TEST 5: Scenario 4 - Multi-Category Exclusion
    // -------------------------------------------------------------
    console.log('\n[5] SCENARIO 4: MULTI-CATEGORY EXCLUSIONS (WATCHES, JEWELRY, ALCOHOL, LEATHER):');
    const multiExclusionProfile = {
      recipientName: 'Priya',
      relationship: 'sister',
      occasion: 'birthday',
      interests: ['tech', 'music'],
      personality: ['innovative', 'dynamic'],
      desiredEmotion: 'delight',
      budget: { min: 5000, max: 40000, currency: 'INR' },
      exclusions: ['watches', 'jewelry', 'alcohol', 'leather'],
    };

    const multiResult = await generateGroundedRecommendations(multiExclusionProfile, { limit: 5 });
    assert(multiResult.items.length > 0, 'Expected recommendations for multi-exclusion scenario');
    for (const it of multiResult.items) {
      const p = it.product;
      const cat = (p.categoryName || '').toLowerCase();
      const tags = (p.tags || []).join(' ').toLowerCase();
      assert(!cat.includes('watch') && !cat.includes('horology'), `Watch excluded but found: ${p.name}`);
      assert(!cat.includes('leather') && !tags.includes('leather'), `Leather excluded but found: ${p.name}`);
      assert(!cat.includes('barware') && !cat.includes('alcohol'), `Alcohol excluded but found: ${p.name}`);
      assert(!tags.includes('jewelry') && !tags.includes('rings'), `Jewelry excluded but found: ${p.name}`);
    }
    console.log(`  ✓ PASSED: Multi-category exclusions strictly honored across all results`);

    // -------------------------------------------------------------
    // TEST 6: Edge Case - Impossible Constraints Honest Empty State
    // -------------------------------------------------------------
    console.log('\n[6] EDGE CASE: IMPOSSIBLE CONSTRAINTS (HONEST EMPTY STATE):');
    const impossibleProfile = {
      recipientName: 'Impossible User',
      relationship: 'partner',
      occasion: 'anniversary',
      interests: ['fine writing'],
      personality: ['refined'],
      desiredEmotion: 'romance',
      budget: { min: 10, max: 50, currency: 'INR' }, // No active product exists under ₹50
      exclusions: [],
    };

    const emptyResult = await generateGroundedRecommendations(impossibleProfile, { limit: 5 });
    assert.strictEqual(emptyResult.items.length, 0, 'Items must be empty for impossible budget');
    assert.strictEqual(emptyResult.eligibleCount, 0, 'Eligible count must be 0');
    assert(
      emptyResult.message.includes('No active products matched'),
      'Must return honest non-synthetic message'
    );
    console.log('  ✓ PASSED: Impossible constraint returns an honest empty state without hallucination');

    // -------------------------------------------------------------
    // TEST 7: Edge Case - Strict Budget Boundary Precision
    // -------------------------------------------------------------
    console.log('\n[7] EDGE CASE: STRICT BUDGET BOUNDARY PRECISION:');
    const boundaryProfile = {
      recipientName: 'Boundary Tester',
      relationship: 'friend',
      occasion: 'birthday',
      interests: ['tea'],
      personality: ['curator'],
      desiredEmotion: 'warmth',
      budget: { min: 500, max: 1199, currency: 'INR' }, // Exact price of Vahdam Blush Assorted Teas (₹1199)
      exclusions: [],
    };

    const boundaryResult = await generateGroundedRecommendations(boundaryProfile, { limit: 5 });
    assert(boundaryResult.items.length > 0, 'Expected at least one item at boundary');
    const boundaryItem = boundaryResult.items.find(it => it.product.slug === 'vahdam-blush-assorted-teas-gift-box');
    assert(boundaryItem, 'Expected product priced exactly at boundary (₹1199) to be included');
    for (const it of boundaryResult.items) {
      assert(it.product.price <= 1199, `Item ${it.product.name} at ₹${it.product.price} exceeded strict ₹1199 boundary`);
    }
    console.log('  ✓ PASSED: Budget boundary condition honored with mathematical precision');

    // -------------------------------------------------------------
    // TEST 8: Recommendation Diversity - Brand Ceiling Cap
    // -------------------------------------------------------------
    console.log('\n[8] RECOMMENDATION DIVERSITY: BRAND CEILING ENFORCEMENT:');
    const broadTechProfile = {
      recipientName: 'Tech Enthusiast',
      relationship: 'friend',
      occasion: 'birthday',
      interests: ['Audiophile Audio & Headphones', 'Smart Tech & Wearables'],
      personality: ['innovative', 'refined'],
      desiredEmotion: 'celebration',
      budget: { min: 5000, max: 70000, currency: 'INR' },
      exclusions: [],
    };

    const broadResult = await generateGroundedRecommendations(broadTechProfile, { limit: 8 });
    assert(broadResult.items.length >= 4, 'Expected multiple diverse recommendations');
    const brandCounts = {};
    for (const it of broadResult.items) {
      const brand = it.product.retailer?.name || 'Unknown';
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;
      assert(
        brandCounts[brand] <= 2,
        `Brand "${brand}" appeared ${brandCounts[brand]} times, exceeding diversity cap of 2`
      );
    }
    console.log('  ✓ PASSED: Brand diversity cap (max 2 per brand) preserved across large candidate pools');

    console.log('\n================================================================');
    console.log('🎉 ALL CATALOGUE QUALITY & EXPANDED SCENARIOS TESTS PASSED!');
    console.log('================================================================\n');
  } finally {
    Product.find = originalFind;
  }
}

runCatalogueQualityTests().catch((err) => {
  console.error(err);
  process.exit(1);
});
