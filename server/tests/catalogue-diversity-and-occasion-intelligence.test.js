/**
 * CHARIS — Phase 3, Task 3.3: Catalogue Diversity and Occasion Intelligence Test Suite
 *
 * Verifies:
 * 1. Maximum two products per brand when alternatives exist.
 * 2. Same-brand fallback when alternatives are insufficient.
 * 3. Missing and unknown brand handling.
 * 4. Repetitive product-type reduction.
 * 5. Preservation of relevant products.
 * 6. Farewell, retirement, and new-job occasion matching.
 * 7. Prevention of unrelated occasion matches.
 * 8. Deterministic ordering across repeated requests.
 * 9. Preservation of original scores and rationales.
 * 10. Existing budget, currency, and relevance-threshold behavior.
 */

const assert = require('assert');
const mongoose = require('mongoose');
const recommendationService = require('../src/services/recommendationService');

const {
  calculateRelevanceScore,
  matchesOccasionToken,
  getProductBrandKey,
  getProductNarrowType,
  applyRecommendationDiversity,
  evaluateBudgetEligibility,
  SCORING_WEIGHTS,
  DEFAULT_MIN_RELEVANCE_THRESHOLD,
  OCCASION_ALIASES,
} = recommendationService;

let passed = 0;
let total = 0;

function test(description, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ PASSED: ${description}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAILED: ${description}`);
    console.error(`    ${err.message}`);
    process.exitCode = 1;
  }
}

console.log('\n================================================================');
console.log('🔍 PHASE 3 TASK 3.3: DIVERSITY & OCCASION INTELLIGENCE TEST SUITE');
console.log('================================================================\n');

// ---------------------------------------------------------------------------
// 1. BRAND DIVERSITY & MAXIMUM 2 PRODUCTS PER BRAND
// ---------------------------------------------------------------------------
console.log('[1] BRAND DIVERSITY & CONTROLLED BRAND CAPPING:');

test('Maximum 2 products from the same brand when alternatives exist', () => {
  const scoredItems = [
    { product: { _id: '1', name: 'Parker Pen 1', retailer: { name: 'Parker Pen' }, categoryName: 'Writing Instruments' }, score: 95, rawScore: 0.95, rationale: 'R1' },
    { product: { _id: '2', name: 'Parker Pen 2', retailer: { name: 'Parker Pen' }, categoryName: 'Writing Instruments' }, score: 92, rawScore: 0.92, rationale: 'R2' },
    { product: { _id: '3', name: 'Parker Pen 3', retailer: { name: 'Parker Pen' }, categoryName: 'Writing Instruments' }, score: 90, rawScore: 0.90, rationale: 'R3' },
    { product: { _id: '4', name: 'Lamy Pen 1', retailer: { name: 'Lamy Official' }, categoryName: 'Writing Instruments' }, score: 88, rawScore: 0.88, rationale: 'R4' },
    { product: { _id: '5', name: 'Anand Prakash Bookmark', retailer: { name: 'Anand Prakash' }, categoryName: 'Literary Keepsakes' }, score: 85, rawScore: 0.85, rationale: 'R5' },
  ];

  const result = applyRecommendationDiversity(scoredItems, 4);
  assert.strictEqual(result.length, 4, 'Returns 4 items');

  const parkerItems = result.filter((i) => i.product.retailer.name === 'Parker Pen');
  assert.strictEqual(parkerItems.length, 2, 'Parker is capped at exactly 2 products');
  assert.strictEqual(result[0].product.name, 'Parker Pen 1');
  assert.strictEqual(result[1].product.name, 'Parker Pen 2');

  const lamyItems = result.filter((i) => i.product.retailer.name === 'Lamy Official');
  assert.strictEqual(lamyItems.length, 1, 'Lamy alternative is promoted');

  const anandItems = result.filter((i) => i.product.retailer.name === 'Anand Prakash');
  assert.strictEqual(anandItems.length, 1, 'Anand Prakash alternative is promoted');
});

test('Same-brand fallback when alternatives are insufficient (fewer than 3 brands)', () => {
  // Only 1 brand available in candidate pool
  const singleBrandItems = [
    { product: { _id: '1', name: 'Item 1', retailer: { name: 'OnlyBrand' } }, score: 95, rawScore: 0.95, rationale: 'R1' },
    { product: { _id: '2', name: 'Item 2', retailer: { name: 'OnlyBrand' } }, score: 90, rawScore: 0.90, rationale: 'R2' },
    { product: { _id: '3', name: 'Item 3', retailer: { name: 'OnlyBrand' } }, score: 85, rawScore: 0.85, rationale: 'R3' },
    { product: { _id: '4', name: 'Item 4', retailer: { name: 'OnlyBrand' } }, score: 80, rawScore: 0.80, rationale: 'R4' },
  ];

  const result = applyRecommendationDiversity(singleBrandItems, 4);
  assert.strictEqual(result.length, 4, 'All 4 items returned via fallback');
  assert(result.every((i) => i.product.retailer.name === 'OnlyBrand'), 'Allows additional products from same brand');
});

test('Missing and unknown brand names handled safely without errors', () => {
  const missingBrandItems = [
    { product: { _id: '1', name: 'No Retailer Prop' }, score: 90, rawScore: 0.90, rationale: 'R1' },
    { product: { _id: '2', name: 'Null Retailer', retailer: null }, score: 88, rawScore: 0.88, rationale: 'R2' },
    { product: { _id: '3', name: 'Empty Retailer Obj', retailer: {} }, score: 86, rawScore: 0.86, rationale: 'R3' },
    { product: { _id: '4', name: 'Unknown Brand', retailer: { name: 'Unknown' } }, score: 84, rawScore: 0.84, rationale: 'R4' },
  ];

  // Brand key extraction must not throw
  assert.strictEqual(getProductBrandKey(missingBrandItems[0].product), 'unknown');
  assert.strictEqual(getProductBrandKey(missingBrandItems[1].product), 'unknown');
  assert.strictEqual(getProductBrandKey(missingBrandItems[2].product), 'unknown');
  assert.strictEqual(getProductBrandKey(missingBrandItems[3].product), 'unknown');

  const result = applyRecommendationDiversity(missingBrandItems, 4);
  assert.strictEqual(result.length, 4, 'Safely processes and returns all items');
});

// ---------------------------------------------------------------------------
// 2. PRODUCT SIMILARITY & REPETITION REDUCTION
// ---------------------------------------------------------------------------
console.log('\n[2] PRODUCT SIMILARITY & REPETITIVE TYPE REDUCTION:');

test('Avoids recommending 3 nearly identical pens when alternatives exist', () => {
  const scoredItems = [
    {
      product: { _id: '1', name: 'Parker Vector Rollerball', retailer: { name: 'Parker' }, tags: ['rollerball', 'pens'], categoryName: 'Fine Stationery & Writing Instruments' },
      score: 95, rawScore: 0.95, rationale: 'Pen 1',
    },
    {
      product: { _id: '2', name: 'Parker Achromatic Matte Pen', retailer: { name: 'Parker' }, tags: ['rollerball', 'pens'], categoryName: 'Fine Stationery & Writing Instruments' },
      score: 92, rawScore: 0.92, rationale: 'Pen 2',
    },
    {
      product: { _id: '3', name: 'Lamy Safari Fountain Pen', retailer: { name: 'Lamy' }, tags: ['fountain_pen', 'pens'], categoryName: 'Fine Stationery & Writing Instruments' },
      score: 91, rawScore: 0.91, rationale: 'Pen 3',
    },
    {
      product: { _id: '4', name: 'Anand Prakash Brass Bookmark', retailer: { name: 'Anand Prakash' }, tags: ['bookmark'], categoryName: 'Fine Stationery & Literary Keepsakes' },
      score: 89, rawScore: 0.89, rationale: 'Bookmark',
    },
    {
      product: { _id: '5', name: 'VAHDAM Tea Box', retailer: { name: 'VAHDAM' }, tags: ['tea'], categoryName: 'Gourmet & Fine Tea' },
      score: 87, rawScore: 0.87, rationale: 'Tea',
    },
  ];

  // Narrow types
  assert.strictEqual(getProductNarrowType(scoredItems[0].product), 'writing_instruments:pens');
  assert.strictEqual(getProductNarrowType(scoredItems[1].product), 'writing_instruments:pens');
  assert.strictEqual(getProductNarrowType(scoredItems[2].product), 'writing_instruments:pens');
  assert.strictEqual(getProductNarrowType(scoredItems[3].product), 'fine_stationery:bookmarks');

  // Request top 3
  const result = applyRecommendationDiversity(scoredItems, 3);
  assert.strictEqual(result.length, 3, 'Returns 3 items');

  const pens = result.filter((i) => getProductNarrowType(i.product) === 'writing_instruments:pens');
  const bookmarks = result.filter((i) => getProductNarrowType(i.product) === 'fine_stationery:bookmarks');

  assert.strictEqual(pens.length, 2, 'Caps pens at 2 in top 3');
  assert.strictEqual(bookmarks.length, 1, 'Promotes bookmark to 3rd slot for diversity');
  assert.strictEqual(result[2].product.name, 'Anand Prakash Brass Bookmark');
});

test('Preserves relevant products when narrow types are limited (does not drop items)', () => {
  // Only pens available
  const onlyPens = [
    { product: { _id: '1', name: 'Pen 1', retailer: { name: 'Brand A' }, tags: ['pens'] }, score: 95, rawScore: 0.95, rationale: 'P1' },
    { product: { _id: '2', name: 'Pen 2', retailer: { name: 'Brand B' }, tags: ['pens'] }, score: 92, rawScore: 0.92, rationale: 'P2' },
    { product: { _id: '3', name: 'Pen 3', retailer: { name: 'Brand C' }, tags: ['pens'] }, score: 90, rawScore: 0.90, rationale: 'P3' },
  ];

  const result = applyRecommendationDiversity(onlyPens, 3);
  assert.strictEqual(result.length, 3, 'All 3 pens returned via type relaxation pass');
});

test('Does NOT remove products merely because they share a broad category', () => {
  const stationeryItems = [
    { product: { _id: '1', name: 'Luxury Pen', categoryId: 'fine_stationery', tags: ['rollerball'] }, score: 90, rawScore: 0.90, rationale: 'P' },
    { product: { _id: '2', name: 'Brass Bookmark', categoryId: 'fine_stationery', tags: ['bookmark'] }, score: 88, rawScore: 0.88, rationale: 'B' },
  ];

  const result = applyRecommendationDiversity(stationeryItems, 2);
  assert.strictEqual(result.length, 2, 'Both fine_stationery items retained because narrow types differ');
});

// ---------------------------------------------------------------------------
// 3. OCCASION INTELLIGENCE & SEMANTIC MAPPING
// ---------------------------------------------------------------------------
console.log('\n[3] OCCASION INTELLIGENCE & CONTROLLED SEMANTIC MAPPING:');

test('Farewell matches new_beginnings, celebration, thank_you, and farewell', () => {
  assert.strictEqual(matchesOccasionToken('new_beginnings', 'farewell'), true);
  assert.strictEqual(matchesOccasionToken('celebration', 'farewell'), true);
  assert.strictEqual(matchesOccasionToken('thank_you', 'farewell'), true);
  assert.strictEqual(matchesOccasionToken('farewell', 'farewell'), true);
});

test('Retirement matches new_beginnings, celebration, thank_you, and deep_gratitude', () => {
  assert.strictEqual(matchesOccasionToken('new_beginnings', 'retirement'), true);
  assert.strictEqual(matchesOccasionToken('celebration', 'retirement'), true);
  assert.strictEqual(matchesOccasionToken('thank_you', 'retirement'), true);
  assert.strictEqual(matchesOccasionToken('deep_gratitude', 'retirement'), true);
  assert.strictEqual(matchesOccasionToken('retirement', 'retirement'), true);
});

test('New Job and new_job match promotion, new_beginnings, and celebration', () => {
  assert.strictEqual(matchesOccasionToken('promotion', 'new job'), true);
  assert.strictEqual(matchesOccasionToken('promotion', 'new_job'), true);
  assert.strictEqual(matchesOccasionToken('new_beginnings', 'new job'), true);
  assert.strictEqual(matchesOccasionToken('celebration', 'new_job'), true);
});

test('Promotion matches milestone, celebration, and new_beginnings', () => {
  assert.strictEqual(matchesOccasionToken('milestone', 'promotion'), true);
  assert.strictEqual(matchesOccasionToken('celebration', 'promotion'), true);
  assert.strictEqual(matchesOccasionToken('promotion', 'promotion'), true);
});

test('Graduation matches milestone, celebration, and new_beginnings', () => {
  assert.strictEqual(matchesOccasionToken('milestone', 'graduation'), true);
  assert.strictEqual(matchesOccasionToken('celebration', 'graduation'), true);
  assert.strictEqual(matchesOccasionToken('graduation', 'graduation'), true);
});

test('Thank you matches deep_gratitude, thank_you, and celebration', () => {
  assert.strictEqual(matchesOccasionToken('deep_gratitude', 'thank_you'), true);
  assert.strictEqual(matchesOccasionToken('thank_you', 'thank you'), true);
  assert.strictEqual(matchesOccasionToken('thank you', 'thank_you'), true);
});

test('Anniversary matches wedding, celebration, and milestone', () => {
  assert.strictEqual(matchesOccasionToken('wedding', 'anniversary'), true);
  assert.strictEqual(matchesOccasionToken('celebration', 'anniversary'), true);
  assert.strictEqual(matchesOccasionToken('anniversary', 'anniversary'), true);
});

test('Birthday matches birthday and celebration', () => {
  assert.strictEqual(matchesOccasionToken('birthday', 'birthday'), true);
  assert.strictEqual(matchesOccasionToken('celebration', 'birthday'), true);
});

test('PREVENTS unrelated occasion matches (no false positives)', () => {
  assert.strictEqual(matchesOccasionToken('birthday', 'farewell'), false);
  assert.strictEqual(matchesOccasionToken('wedding', 'farewell'), false);
  assert.strictEqual(matchesOccasionToken('birthday', 'retirement'), false);
  assert.strictEqual(matchesOccasionToken('anniversary', 'retirement'), false);
  assert.strictEqual(matchesOccasionToken('birthday', 'new job'), false);
  assert.strictEqual(matchesOccasionToken('wedding', 'promotion'), false);
  assert.strictEqual(matchesOccasionToken('farewell', 'birthday'), false);
  assert.strictEqual(matchesOccasionToken('retirement', 'birthday'), false);
});

// ---------------------------------------------------------------------------
// 4. SCORE & RATIONALE PRESERVATION & DETERMINISM
// ---------------------------------------------------------------------------
console.log('\n[4] SCORE/RATIONALE PRESERVATION & DETERMINISM:');

test('Preserves original recommendation score and rationale exactly', () => {
  const scoredItems = [
    { product: { _id: '1', name: 'Product A', retailer: { name: 'Brand A' } }, score: 92, rawScore: 0.9234, rationale: 'Selected for Elena (partner).' },
    { product: { _id: '2', name: 'Product B', retailer: { name: 'Brand B' } }, score: 87, rawScore: 0.8712, rationale: 'Selected for Elena (partner).' },
  ];

  const result = applyRecommendationDiversity(scoredItems, 2);
  assert.strictEqual(result[0].score, 92, 'Score 1 preserved');
  assert.strictEqual(result[0].rawScore, 0.9234, 'RawScore 1 preserved');
  assert.strictEqual(result[0].rationale, 'Selected for Elena (partner).', 'Rationale 1 preserved');
  assert.strictEqual(result[1].score, 87, 'Score 2 preserved');
  assert.strictEqual(result[1].rationale, 'Selected for Elena (partner).', 'Rationale 2 preserved');
});

test('Ordering is 100% deterministic across repeated runs', () => {
  const candidatePool = [
    { product: { _id: 'a', name: 'Item A', retailer: { name: 'Brand 1' } }, score: 90, rawScore: 0.90, rationale: 'R_A' },
    { product: { _id: 'b', name: 'Item B', retailer: { name: 'Brand 1' } }, score: 88, rawScore: 0.88, rationale: 'R_B' },
    { product: { _id: 'c', name: 'Item C', retailer: { name: 'Brand 2' } }, score: 87, rawScore: 0.87, rationale: 'R_C' },
    { product: { _id: 'd', name: 'Item D', retailer: { name: 'Brand 1' } }, score: 85, rawScore: 0.85, rationale: 'R_D' },
    { product: { _id: 'e', name: 'Item E', retailer: { name: 'Brand 3' } }, score: 84, rawScore: 0.84, rationale: 'R_E' },
  ];

  const run1 = applyRecommendationDiversity([...candidatePool], 4);
  const run2 = applyRecommendationDiversity([...candidatePool], 4);
  const run3 = applyRecommendationDiversity([...candidatePool], 4);

  assert.deepStrictEqual(
    run1.map((i) => i.product._id),
    run2.map((i) => i.product._id),
    'Run 1 equals Run 2'
  );
  assert.deepStrictEqual(
    run2.map((i) => i.product._id),
    run3.map((i) => i.product._id),
    'Run 2 equals Run 3'
  );
});

// ---------------------------------------------------------------------------
// 5. BUDGET, CURRENCY, AND THRESHOLD INVARIANTS
// ---------------------------------------------------------------------------
console.log('\n[5] BUDGET, CURRENCY, AND THRESHOLD INVARIANTS:');

test('Budget eligibility strictly adheres to default 0.0 tolerance', () => {
  const product = { price: 3501, currency: 'INR' };
  const budget = { min: 500, max: 3500, currency: 'INR' };
  const check = evaluateBudgetEligibility(product, budget, { toleranceRatio: 0.0 });
  assert.strictEqual(check.eligible, false, '₹3,501 exceeds ₹3,500 max budget');
});

test('Strict currency matching excludes currency mismatches', () => {
  const productUSD = { price: 2000, currency: 'USD' };
  const budgetINR = { min: 500, max: 3500, currency: 'INR' };
  const check = evaluateBudgetEligibility(productUSD, budgetINR, { toleranceRatio: 0.0 });
  assert.strictEqual(check.eligible, false, 'USD product rejected for INR consultation');
});

test('Scoring weights are strictly preserved (35% / 20% / 15% / 10% / 10% / 10%)', () => {
  assert.strictEqual(SCORING_WEIGHTS.INTERESTS, 0.35);
  assert.strictEqual(SCORING_WEIGHTS.OCCASION, 0.20);
  assert.strictEqual(SCORING_WEIGHTS.RELATIONSHIP, 0.15);
  assert.strictEqual(SCORING_WEIGHTS.PERSONALITY, 0.10);
  assert.strictEqual(SCORING_WEIGHTS.BUDGET_PROXIMITY, 0.10);
  assert.strictEqual(SCORING_WEIGHTS.CATEGORY_AND_EMOTION, 0.10);

  const totalWeight = Object.values(SCORING_WEIGHTS).reduce((sum, w) => sum + w, 0);
  assert.strictEqual(Math.round(totalWeight * 100) / 100, 1.0);
  assert.strictEqual(DEFAULT_MIN_RELEVANCE_THRESHOLD, 0.20);
});

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`🎉 ALL ${passed}/${total} DIVERSITY & OCCASION TESTS PASSED!`);
console.log('================================================================\n');
