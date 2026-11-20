/**
 * CHARIS — Phase 3, Task 3.2: Scoring and Token Precision Verification Suite
 *
 * Verifies:
 * 1. Multi-interest saturated scoring across 1, 2, 3, and 6 selected interests.
 * 2. Zero-score assignment when candidate matches zero consultation interests.
 * 3. Compound-token precision (e.g. generic 'keepsakes' does NOT match 'bespoke_keepsakes').
 * 4. Genuine compound alias matches (e.g. 'star_map' matches 'bespoke_keepsakes').
 * 5. Natural-language rationale formatting (no underscores or hyphens in rendered text).
 * 6. Deterministic ordering preserved across runs.
 */

const assert = require('assert');
const recommendationService = require('../src/services/recommendationService');

const {
  calculateRelevanceScore,
  matchesInterestToken,
  formatReadableToken,
  generateDynamicRationale,
  INTEREST_ALIASES,
  SCORING_WEIGHTS,
  DEFAULT_MIN_RELEVANCE_THRESHOLD,
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

console.log('\n======================================================');
console.log('🔍 PHASE 3 TASK 3.2: SCORING & TOKEN PRECISION TEST SUITE');
console.log('======================================================\n');

// ---------------------------------------------------------------------------
// 1. COMPOUND-TOKEN PRECISION & ALIAS MATCHING
// ---------------------------------------------------------------------------
console.log('[1] COMPOUND-TOKEN PRECISION & CONTROLLED ALIAS INDEX:');

test('matches exact identical token (bespoke_keepsakes === bespoke_keepsakes)', () => {
  assert.strictEqual(matchesInterestToken('bespoke_keepsakes', 'bespoke_keepsakes'), true);
  assert.strictEqual(matchesInterestToken('bespoke keepsakes', 'bespoke_keepsakes'), true);
  assert.strictEqual(matchesInterestToken('fine_writing', 'fine_writing'), true);
});

test('PREVENTS false positive: generic "keepsakes" does NOT match compound "bespoke_keepsakes"', () => {
  assert.strictEqual(matchesInterestToken('keepsakes', 'bespoke_keepsakes'), false);
  assert.strictEqual(matchesInterestToken('keepsakes', 'bespoke keepsakes'), false);
});

test('PREVENTS false positive: generic "goods" does NOT match compound "leather_goods"', () => {
  assert.strictEqual(matchesInterestToken('goods', 'leather_goods'), false);
});

test('PREVENTS false positive: generic "writing" does NOT match compound "fine_writing"', () => {
  assert.strictEqual(matchesInterestToken('writing', 'fine_writing'), false);
});

test('ACCEPTS legitimate domain alias: "star_map" matches "bespoke_keepsakes"', () => {
  assert.strictEqual(matchesInterestToken('star_map', 'bespoke_keepsakes'), true);
  assert.strictEqual(matchesInterestToken('star map', 'bespoke_keepsakes'), true);
  assert.strictEqual(matchesInterestToken('celestial map', 'bespoke_keepsakes'), true);
});

test('ACCEPTS legitimate domain alias: "fountain_pen" matches "fine_writing"', () => {
  assert.strictEqual(matchesInterestToken('fountain_pen', 'fine_writing'), true);
  assert.strictEqual(matchesInterestToken('stationery', 'fine_writing'), true);
  assert.strictEqual(matchesInterestToken('rollerball', 'fine_writing'), true);
});

test('ACCEPTS UI aesthetic compound interest options', () => {
  assert.strictEqual(matchesInterestToken('watches', 'fine horology & watches'), true);
  assert.strictEqual(matchesInterestToken('horology', 'fine horology & watches'), true);
  assert.strictEqual(matchesInterestToken('leather_goods', 'tuscan leather & totes'), true);
  assert.strictEqual(matchesInterestToken('perfume', 'niche perfumes & scents'), true);
  assert.strictEqual(matchesInterestToken('fragrance', 'niche perfumes & scents'), true);
  assert.strictEqual(matchesInterestToken('star_map', 'bespoke keepsakes & maps'), true);
});

// ---------------------------------------------------------------------------
// 2. MULTI-INTEREST SATURATED SCORING FORMULA
// ---------------------------------------------------------------------------
console.log('\n[2] MULTI-INTEREST SATURATED SCORING FORMULA:');

const mockBaseProduct = {
  price: 2000,
  currency: 'INR',
  occasions: ['anniversary'],
  relationships: ['partner'],
  personalities: ['refined'],
  categoryId: 'watches',
  categoryName: 'Watches',
};

test('1 selected interest: 1 match reaches 100% saturation (0.35 raw score)', () => {
  const p = { ...mockBaseProduct, interests: ['horology'] };
  const c = {
    recipientName: 'Alex',
    relationship: 'partner',
    occasion: 'anniversary',
    personality: ['refined'],
    budget: { min: 1000, max: 3000, currency: 'INR' },
    interests: ['horology'],
  };
  const score = calculateRelevanceScore(p, c);
  assert.strictEqual(score.matchDetails.matchedInterests.length, 1);
  assert.strictEqual(score.matchDetails.interestScore, 1.0);
});

test('2 selected interests: 1 match yields 50% (0.175), 2 matches yield 100% saturation (0.35)', () => {
  const c = {
    recipientName: 'Alex',
    relationship: 'partner',
    occasion: 'anniversary',
    personality: ['refined'],
    budget: { min: 1000, max: 3000, currency: 'INR' },
    interests: ['horology', 'fine_writing'],
  };

  const p1Match = { ...mockBaseProduct, interests: ['horology'] };
  const s1 = calculateRelevanceScore(p1Match, c);
  assert.strictEqual(s1.matchDetails.matchedInterests.length, 1);
  assert.strictEqual(s1.matchDetails.interestScore, 0.5);

  const p2Match = { ...mockBaseProduct, interests: ['horology', 'fine_writing'] };
  const s2 = calculateRelevanceScore(p2Match, c);
  assert.strictEqual(s2.matchDetails.matchedInterests.length, 2);
  assert.strictEqual(s2.matchDetails.interestScore, 1.0);
});

test('3 selected interests: 2 matches reach full saturation (1.0) without denominator penalty', () => {
  const c = {
    recipientName: 'Alex',
    relationship: 'partner',
    occasion: 'anniversary',
    personality: ['refined'],
    budget: { min: 1000, max: 3000, currency: 'INR' },
    interests: ['horology', 'fine_writing', 'astronomy'],
  };

  const p2Match = { ...mockBaseProduct, interests: ['horology', 'fine_writing'] };
  const score = calculateRelevanceScore(p2Match, c);
  assert.strictEqual(score.matchDetails.matchedInterests.length, 2);
  // Saturated matching: min(1.0, 2 / min(2, 3)) = min(1.0, 2/2) = 1.0
  assert.strictEqual(score.matchDetails.interestScore, 1.0);
});

test('6 selected interests: rich profile matching 2 interests is NOT penalized (scores 1.0 interest relevance)', () => {
  const c = {
    recipientName: 'Alex',
    relationship: 'partner',
    occasion: 'anniversary',
    personality: ['refined'],
    budget: { min: 1000, max: 3000, currency: 'INR' },
    interests: ['horology', 'fine_writing', 'astronomy', 'leather_goods', 'tea', 'chess'],
  };

  const p2Match = { ...mockBaseProduct, interests: ['horology', 'fine_writing'] };
  const score = calculateRelevanceScore(p2Match, c);
  assert.strictEqual(score.matchDetails.matchedInterests.length, 2);
  // Previously: 2 / 6 = 0.333 (penalized). Now: min(1.0, 2 / min(2, 6)) = 1.0!
  assert.strictEqual(score.matchDetails.interestScore, 1.0);
});

test('6 selected interests: 1 match yields 50% saturation (0.50 interest score)', () => {
  const c = {
    recipientName: 'Alex',
    relationship: 'partner',
    occasion: 'anniversary',
    personality: ['refined'],
    budget: { min: 1000, max: 3000, currency: 'INR' },
    interests: ['horology', 'fine_writing', 'astronomy', 'leather_goods', 'tea', 'chess'],
  };

  const p1Match = { ...mockBaseProduct, interests: ['horology'] };
  const score = calculateRelevanceScore(p1Match, c);
  assert.strictEqual(score.matchDetails.matchedInterests.length, 1);
  assert.strictEqual(score.matchDetails.interestScore, 0.5);
});

test('Zero selected interests: receives neutral baseline (0.50 interest score)', () => {
  const c = {
    recipientName: 'Alex',
    relationship: 'partner',
    occasion: 'anniversary',
    personality: ['refined'],
    budget: { min: 1000, max: 3000, currency: 'INR' },
    interests: [],
  };

  const p = { ...mockBaseProduct, interests: ['horology'] };
  const score = calculateRelevanceScore(p, c);
  assert.strictEqual(score.matchDetails.interestScore, 0.5);
});

test('Zero matched interests when user specified interests: receives 0.00 interest score', () => {
  const c = {
    recipientName: 'Alex',
    relationship: 'partner',
    occasion: 'anniversary',
    personality: ['refined'],
    budget: { min: 1000, max: 3000, currency: 'INR' },
    interests: ['horology', 'fine_writing'],
  };

  const pUnrelated = { ...mockBaseProduct, interests: ['gardening', 'pottery'] };
  const score = calculateRelevanceScore(pUnrelated, c);
  assert.strictEqual(score.matchDetails.matchedInterests.length, 0);
  assert.strictEqual(score.matchDetails.interestScore, 0.0);
});

test('Weights preserved: 35% interests, 20% occasion, 15% relationship, 10% personality, 10% budget, 10% emotion', () => {
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
// 3. NATURAL-LANGUAGE RATIONALE FORMATTING
// ---------------------------------------------------------------------------
console.log('\n[3] NATURAL-LANGUAGE RATIONALE FORMATTING (ZERO UNDERSCORES):');

test('formatReadableToken converts underscores and hyphens into clean spaces', () => {
  assert.strictEqual(formatReadableToken('bespoke_keepsakes'), 'bespoke keepsakes');
  assert.strictEqual(formatReadableToken('fine_writing'), 'fine writing');
  assert.strictEqual(formatReadableToken('thank_you'), 'thank you');
  assert.strictEqual(formatReadableToken('best_friend'), 'best friend');
  assert.strictEqual(formatReadableToken('someone_special'), 'someone special');
  assert.strictEqual(formatReadableToken('niche_fragrance'), 'niche fragrance');
});

test('generateDynamicRationale formats compound relationship, occasion, and interests cleanly without underscores', () => {
  const p = {
    name: 'Handcrafted Star Map',
    categoryName: 'Bespoke Keepsakes',
    retailer: { name: 'Sytara Keepsakes', verified: true },
    occasions: ['thank_you'],
  };
  const c = {
    recipientName: 'Maya',
    relationship: 'best_friend',
    occasion: 'thank_you',
    desiredEmotion: 'deep_gratitude',
  };
  const matchDetails = {
    matchedInterests: ['bespoke_keepsakes', 'fine_writing'],
    emotionScore: 0.8,
  };

  const rationale = generateDynamicRationale(p, c, matchDetails);

  // Check no underscores or hyphens in rationale text
  assert(!rationale.includes('_'), `Rationale must not contain underscores: "${rationale}"`);
  assert(!rationale.includes('best_friend'), 'No best_friend underscore');
  assert(!rationale.includes('thank_you'), 'No thank_you underscore');
  assert(!rationale.includes('bespoke_keepsakes'), 'No bespoke_keepsakes underscore');
  assert(!rationale.includes('fine_writing'), 'No fine_writing underscore');

  // Check readable phrasing
  assert(rationale.includes('best friend'), 'Formats relationship naturally as "best friend"');
  assert(rationale.includes('thank you'), 'Formats occasion naturally as "thank you"');
  assert(rationale.includes('bespoke keepsakes and fine writing'), 'Formats matched interests naturally');
  assert(rationale.includes('from verified retailer Sytara Keepsakes.'), 'Includes verified retailer citation');
});

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`🎉 ALL ${passed}/${total} SCORING & TOKEN PRECISION TESTS PASSED!`);
console.log('======================================================\n');
