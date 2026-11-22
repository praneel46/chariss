const Product = require('../models/Product');

/**
 * Transparent scoring weights for deterministic candidate ranking.
 * Total weights sum strictly to 1.0 (100%).
 *
 * Weight Distribution:
 * - INTERESTS (35%): Direct affinity with recipient's hobbies/interests.
 * - OCCASION (20%): Appropriate for the specific milestone/celebration.
 * - RELATIONSHIP (15%): Suitable for the interpersonal intimacy level.
 * - PERSONALITY (10%): Alignment with recipient's character traits.
 * - BUDGET_PROXIMITY (10%): Price fit within the specified [min, max] range.
 * - CATEGORY_AND_EMOTION (10%): Alignment with requested category and emotional tone.
 */
const SCORING_WEIGHTS = Object.freeze({
  INTERESTS: 0.35,
  OCCASION: 0.20,
  RELATIONSHIP: 0.15,
  PERSONALITY: 0.10,
  BUDGET_PROXIMITY: 0.10,
  CATEGORY_AND_EMOTION: 0.10,
});

/**
 * Minimum relevance threshold (0.0 to 1.0).
 * Candidates with an overall raw score below 0.20 (20%) are considered weak/unrelated matches
 * and are excluded from recommendations to maintain curation quality.
 */
const DEFAULT_MIN_RELEVANCE_THRESHOLD = 0.20;

/**
 * Controlled domain synonyms and aliases for exclusion filtering.
 * Maps high-level exclusion concepts to known database tags and category tokens.
 */
const EXCLUSION_ALIASES = Object.freeze({
  leather: ['leather', 'leather_goods', 'leather goods', 'pelle', 'full_grain_leather'],
  fragrance: ['fragrance', 'perfume', 'perfumes', 'scents', 'scent', 'cologne', 'extrait'],
  perfume: ['fragrance', 'perfume', 'perfumes', 'scents', 'scent', 'cologne', 'extrait'],
  perfumes: ['fragrance', 'perfume', 'perfumes', 'scents', 'scent', 'cologne', 'extrait'],
  scents: ['fragrance', 'perfume', 'perfumes', 'scents', 'scent', 'cologne', 'extrait'],
  watches: ['watches', 'watch', 'horology', 'timepiece', 'timepieces'],
  watch: ['watches', 'watch', 'horology', 'timepiece', 'timepieces'],
  horology: ['watches', 'watch', 'horology', 'timepiece', 'timepieces'],
  jewelry: ['jewelry', 'jewellery', 'rings', 'ring', 'bracelet', 'necklace', 'earrings'],
  jewellery: ['jewelry', 'jewellery', 'rings', 'ring', 'bracelet', 'necklace', 'earrings'],
  ring: ['ring', 'rings'],
  rings: ['ring', 'rings'],
  alcohol: ['alcohol', 'wine', 'spirits', 'whiskey', 'decanter', 'champagne', 'liquor'],
  wine: ['wine', 'alcohol', 'spirits'],
  tech: ['tech', 'electronics', 'gadgets', 'smart_glasses', 'smart glasses', 'smart_watches', 'smart watch', 'wearables'],
  sunglasses: ['sunglasses', 'eyewear', 'shades', 'frames'],
  eyewear: ['sunglasses', 'eyewear', 'shades', 'frames'],
});

/**
 * Controlled domain synonyms and aliases for interest matching.
 * Ensures precise semantic alignment while preventing false-positive generic constituent matches.
 */
const INTEREST_ALIASES = Object.freeze({
  'bespoke keepsakes': [
    'bespoke keepsakes',
    'bespoke_keepsakes',
    'custom keepsakes',
    'heirloom art',
    'star map',
    'star_map',
    'astronomy',
    'celestial map',
    'astronomical chart',
  ],
  'fine writing': [
    'fine writing',
    'fine_writing',
    'stationery',
    'pens',
    'fountain pen',
    'fountain_pen',
    'rollerball',
    'calligraphy',
    'executive tools',
    'executive_tools',
    'journaling',
  ],
  'leather goods': [
    'leather goods',
    'leather_goods',
    'leather',
    'saffiano leather',
    'full grain leather',
    'leather card case',
    'travel wallet',
    'passport case',
  ],
  'perfumes': [
    'perfumes',
    'perfume',
    'fragrance',
    'scents',
    'scent',
    'niche fragrance',
    'niche_fragrance',
    'niche perfume',
    'niche_perfume',
    'artisan perfume',
    'artisan_perfume',
    'botanicals',
    'botanical perfume',
    'eau de parfum',
    'extrait de parfum',
  ],
  'scents': [
    'scents',
    'scent',
    'fragrance',
    'aromatherapy',
    'incense',
    'scented candle',
    'candle',
    'home decor',
  ],
  'tea': ['tea', 'estate tea', 'tea trunk', 'chai', 'tea carnival', 'caddies'],
  'coffee': ['coffee', 'specialty coffee', 'coffee hamper', 'fresh roast'],
  'chocolates': ['chocolates', 'chocolate', 'couverture chocolates', 'confectionery', 'dessert'],
  'chess': ['chess', 'sheesham chess', 'board games', 'wooden games', 'games', 'strategy'],
  'reading': ['reading', 'literature', 'books', 'bookmark', 'brass bookmark', 'poetry'],
  'grooming': ['grooming', 'gentlemans grooming', 'skincare', 'self care', 'luxury ayurveda'],
  'wellness': ['wellness', 'aromatherapy', 'mindful living', 'ayurveda', 'self care'],
  'wine': ['wine', 'crystal decanter', 'decanter', 'barware', 'glassware'],
  'whiskey': ['whiskey', 'double rock', 'crystal glasses', 'barware', 'glassware'],
  'astronomy': ['astronomy', 'star map', 'celestial map', 'astronomical chart'],
  'watches': ['watches', 'watch', 'horology', 'timepiece', 'timepieces'],
  // UI aesthetic interest options from Consultation.tsx
  'bespoke keepsakes & maps': [
    'bespoke keepsakes',
    'bespoke_keepsakes',
    'star map',
    'star_map',
    'custom art',
    'heirloom art',
  ],
  'tuscan leather & totes': [
    'leather goods',
    'leather_goods',
    'leather',
    'saffiano leather',
    'totes',
  ],
  'niche perfumes & scents': [
    'perfumes',
    'perfume',
    'scents',
    'scent',
    'fragrance',
    'niche fragrance',
    'artisan perfume',
  ],
  'fine horology & watches': ['watches', 'watch', 'horology', 'timepiece', 'timepieces'],
  'handcrafted sunglasses': ['sunglasses', 'eyewear', 'shades', 'frames'],
  'biometric rings & health': ['biometric rings', 'rings', 'health', 'wellness', 'wearables'],
  'audiophile audio & headphones': [
    'audiophile audio & headphones',
    'audiophile',
    'audio',
    'headphones',
    'headphone',
    'earphones',
    'earbuds',
    'earpods',
    'spatial_audio',
    'hi_res_audio',
    'music',
    'sound',
  ],
  'smart tech & wearables': [
    'smart tech & wearables',
    'tech',
    'wearables',
    'smart_wearables',
    'gadgets',
    'ai_wearables',
    'smart_glasses',
    'smart_watch',
    'smart_ring',
  ],
});

// Build reverse lookup index for O(1) interest alias matching
const INTEREST_ALIAS_INDEX = new Map();
for (const [canonical, aliases] of Object.entries(INTEREST_ALIASES)) {
  const normCanonical = canonical.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!INTEREST_ALIAS_INDEX.has(normCanonical)) INTEREST_ALIAS_INDEX.set(normCanonical, new Set());
  INTEREST_ALIAS_INDEX.get(normCanonical).add(normCanonical);

  for (const alias of aliases) {
    const normAlias = alias.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
    if (!INTEREST_ALIAS_INDEX.has(normAlias)) INTEREST_ALIAS_INDEX.set(normAlias, new Set());
    INTEREST_ALIAS_INDEX.get(normAlias).add(normCanonical);
  }
}

/**
 * Normalizes token text into lowercased space-separated words.
 */
function normalizeTokenText(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Formats underscore- or hyphen-delimited tokens into readable natural language text.
 * E.g., 'bespoke_keepsakes' -> 'bespoke keepsakes', 'thank_you' -> 'thank you', 'best_friend' -> 'best friend'.
 *
 * @param {string} token
 * @returns {string}
 */
function formatReadableToken(token) {
  if (typeof token !== 'string') return '';
  return token.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Controlled domain synonyms and semantic mappings for occasion matching.
 * Maps user consultation occasions to suitable catalogue product occasion concepts.
 */
const OCCASION_ALIASES = Object.freeze({
  farewell: ['farewell', 'retirement', 'new_beginnings', 'celebration', 'thank_you'],
  retirement: ['retirement', 'farewell', 'new_beginnings', 'celebration', 'thank_you', 'deep_gratitude'],
  'new job': ['new job', 'new_job', 'promotion', 'new_beginnings', 'celebration'],
  new_job: ['new job', 'new_job', 'promotion', 'new_beginnings', 'celebration'],
  promotion: ['promotion', 'new job', 'new_job', 'milestone', 'celebration', 'new_beginnings'],
  graduation: ['graduation', 'milestone', 'celebration', 'new_beginnings'],
  'thank you': ['thank you', 'thank_you', 'deep_gratitude', 'celebration'],
  thank_you: ['thank you', 'thank_you', 'deep_gratitude', 'celebration'],
  anniversary: ['anniversary', 'wedding', 'celebration', 'milestone'],
  wedding: ['wedding', 'anniversary', 'celebration', 'milestone', 'new_beginnings'],
  birthday: ['birthday', 'celebration'],
  housewarming: ['housewarming', 'new_beginnings', 'celebration'],
  festival: ['festival', 'celebration'],
  milestone: ['milestone', 'celebration', 'achievement'],
});

// Build reverse lookup index for O(1) occasion alias matching
const OCCASION_ALIAS_INDEX = new Map();
for (const [consultationOccasion, aliases] of Object.entries(OCCASION_ALIASES)) {
  const normKey = normalizeTokenText(consultationOccasion);
  if (!OCCASION_ALIAS_INDEX.has(normKey)) {
    OCCASION_ALIAS_INDEX.set(normKey, new Set());
  }
  OCCASION_ALIAS_INDEX.get(normKey).add(normKey);

  for (const alias of aliases) {
    const normAlias = normalizeTokenText(alias);
    OCCASION_ALIAS_INDEX.get(normKey).add(normAlias);
  }
}

/**
 * Safely matches an individual product occasion token against a user-specified consultation occasion.
 * Uses exact match and controlled OCCASION_ALIASES mapping.
 * Avoids unrestricted substring matching.
 *
 * @param {string} productOccasion - Occasion tag from product
 * @param {string} consultationOccasion - Occasion string from consultation
 * @returns {boolean} True if legitimately matched
 */
function matchesOccasionToken(productOccasion, consultationOccasion) {
  if (!productOccasion || !consultationOccasion) return false;

  const p = normalizeTokenText(productOccasion);
  const c = normalizeTokenText(consultationOccasion);
  if (!p || !c) return false;

  // 1. Direct equality after normalization (e.g. 'thank you' === 'thank you')
  if (p === c) return true;

  // 2. Controlled domain mapping from consultation occasion to acceptable product occasions
  const allowedProductOccasions = OCCASION_ALIAS_INDEX.get(c);
  if (allowedProductOccasions && allowedProductOccasions.has(p)) {
    return true;
  }

  return false;
}

/**
 * Escapes characters for regex whole-word boundary matching.
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Normalizes an array of strings into lowercase trimmed tokens.
 */
function normalizeTokens(tokens) {
  if (!Array.isArray(tokens)) return [];
  return tokens
    .map((t) => (typeof t === 'string' ? t.trim().toLowerCase() : ''))
    .filter(Boolean);
}

/**
 * Checks whether a product matches any explicit consultation exclusion terms.
 *
 * Rules:
 * - Checks structured product attributes: categoryId, categoryName, tags, interests.
 * - Uses exact token comparison or whole-word matching.
 * - Checks product title using whole-word boundary matching only (never substring).
 * - Avoids arbitrary substring matching across long descriptions to prevent false positives
 *   (e.g., excluding "leather" will NOT exclude a silk scarf whose description mentions "leather jacket",
 *    and excluding "art" will NOT exclude "smart glasses").
 *
 * @param {Object} product - MongoDB product document
 * @param {Array<string>} exclusions - List of exclusion strings
 * @returns {boolean} True if the product should be excluded
 */
function isProductExcluded(product, exclusions) {
  if (!Array.isArray(exclusions) || exclusions.length === 0) return false;

  // Gather structured classification tokens (exact token matching)
  const structuredTokens = new Set([
    (product.categoryId || '').trim().toLowerCase(),
    (product.categoryName || '').trim().toLowerCase(),
    ...normalizeTokens(product.tags),
    ...normalizeTokens(product.interests),
  ]);

  const productName = (product.name || '').trim();

  for (const rawExclusion of exclusions) {
    const term = String(rawExclusion || '').trim().toLowerCase();
    if (!term) continue;

    // Collect term plus known domain aliases
    const searchTokens = new Set([term, ...(EXCLUSION_ALIASES[term] || [])]);

    for (const searchToken of searchTokens) {
      // 1. Exact match against structured classification tokens
      if (structuredTokens.has(searchToken)) {
        return true;
      }

      // 2. Whole-word match in product name (e.g. "Leather Bag" has whole-word "leather")
      try {
        const wordRegex = new RegExp(`(^|\\b|_)${escapeRegex(searchToken)}(\\b|_|$)`, 'i');
        if (wordRegex.test(productName)) {
          return true;
        }
      } catch {
        if (productName.toLowerCase() === searchToken) return true;
      }
    }
  }

  return false;
}

/**
 * Evaluates budget eligibility.
 *
 * Requirements:
 * - Strict currency matching: Does not compare across currencies without exchange rates.
 * - Minimum budget: Price must strictly be >= minBudget.
 * - Maximum budget: Default tolerance is 0.0 (strict matching: price <= maxBudget).
 *   Configurable tolerance (e.g. 0.05 or 0.10) can be enabled via options.toleranceRatio.
 *
 * @param {Object} product - Product document
 * @param {Object} budget - Consultation budget { min, max, currency }
 * @param {Object} [options] - Configuration options { toleranceRatio }
 * @returns {{ eligible: boolean, reason?: string }}
 */
function evaluateBudgetEligibility(product, budget, options = {}) {
  const budgetCurrency = String(budget?.currency || 'INR').trim().toUpperCase();
  const productCurrency = String(product.currency || 'INR').trim().toUpperCase();

  // Currency mismatch rejection
  if (budgetCurrency !== productCurrency) {
    return {
      eligible: false,
      reason: `Currency mismatch: consultation specifies ${budgetCurrency} but product is in ${productCurrency}`,
    };
  }

  const price = Number(product.price);
  if (isNaN(price) || price < 0) {
    return { eligible: false, reason: 'Invalid product price' };
  }

  const minBudget = Number(budget?.min ?? 0);
  const maxBudget = Number(budget?.max ?? Infinity);
  // Default tolerance is 0.0 (strict). Tolerances > 0 must be explicitly configured.
  const toleranceRatio = typeof options.toleranceRatio === 'number' && options.toleranceRatio >= 0
    ? options.toleranceRatio
    : 0.0;
  const allowedMax = maxBudget * (1 + toleranceRatio);

  if (price < minBudget) {
    return {
      eligible: false,
      reason: `Price ₹${price} is below minimum consultation budget ₹${minBudget}`,
    };
  }

  if (price > allowedMax) {
    return {
      eligible: false,
      reason: `Price ₹${price} exceeds maximum consultation budget ₹${maxBudget} (tolerance cap: ₹${allowedMax})`,
    };
  }

  return { eligible: true };
}

/**
 * Calculates a multi-factor deterministic relevance score (0.0 to 1.0)
 * along with matched attribute metadata.
 *
 * Scoring Calibration:
 * - Derived strictly from actual matching evidence.
 * - Zero matching attributes produce a zero or near-zero score (no artificial 70% floor).
 * - Missing consultation profile fields contribute neutral baselines (0.5).
 * - Output scores range from 0 to 99, where 0-25% = weak/irrelevant, 50-75% = moderate, 80-99% = strong.
 *
 * @param {Object} product - MongoDB product document
 * @param {Object} consultation - Persisted consultation document
 * @param {Object} [options] - Options (e.g. toleranceRatio)
 * @returns {{ rawScore: number, scaledScore: number, matchDetails: Object }}
 */
/**
 * Safely matches an individual product tag/interest token against a user-specified interest token.
 * Uses exact matching, space/underscore normalization, and controlled alias index lookup.
 * Rejects generic sub-word partial matches on compound terms (e.g. 'keepsakes' does NOT match 'bespoke_keepsakes').
 *
 * @param {string} productToken - Tag or interest token from product
 * @param {string} userInterestToken - Interest string from consultation
 * @returns {boolean} True if legitimately matched
 */
function matchesInterestToken(productToken, userInterestToken) {
  const p = normalizeTokenText(productToken);
  const u = normalizeTokenText(userInterestToken);
  if (!p || !u) return false;

  // 1. Direct equality after normalization (e.g. 'bespoke_keepsakes' === 'bespoke keepsakes')
  if (p === u) return true;

  // 2. Handle composite user tokens joined by '&' or 'and' (e.g. 'Bespoke Keepsakes & Maps')
  if (u.includes('&') || u.includes(' and ')) {
    const parts = u.split(/\s*(&|\band\b)\s*/).filter((part) => part && part !== '&' && part !== 'and');
    if (parts.some((part) => matchesInterestToken(p, part))) {
      return true;
    }
  }

  // 3. Alias / Controlled domain synonym matching
  const pCanonicals = INTEREST_ALIAS_INDEX.get(p);
  const uCanonicals = INTEREST_ALIAS_INDEX.get(u);
  if (pCanonicals && uCanonicals) {
    for (const c of pCanonicals) {
      if (uCanonicals.has(c)) return true;
    }
  }

  // 4. Exact whole-word boundary matching ONLY for single-word user interests
  // (e.g. user 'astronomy' matches product 'astronomy chart', user 'pen' matches 'rollerball pen')
  // Prevents generic constituent tokens (e.g. 'keepsakes') from falsely matching compound interests (e.g. 'bespoke_keepsakes')
  const uWords = u.split(' ').filter(Boolean);
  const pWords = p.split(' ').filter(Boolean);

  // Compound user interests (>1 word) must NOT be partially matched by generic single words
  if (uWords.length > 1) {
    return false;
  }

  // Single-word user interests (e.g. 'tea') can match product compound terms if it is a distinct whole word (e.g. 'estate tea')
  if (uWords.length === 1 && pWords.includes(u)) {
    const genericStopWords = new Set(['goods', 'items', 'and', 'set', 'box', 'edition', 'pack']);
    if (!genericStopWords.has(u)) {
      return true;
    }
  }

  return false;
}

function calculateRelevanceScore(product, consultation, options = {}) {
  const consultationInterests = normalizeTokens(consultation.interests);
  const consultationPersonalities = normalizeTokens(consultation.personality);
  const consultationCategories = normalizeTokens(consultation.productCategories);
  const consultationOccasion = (consultation.occasion || '').trim().toLowerCase();
  const consultationRelationship = (consultation.relationship || '').trim().toLowerCase();
  const desiredEmotion = (consultation.desiredEmotion || '').trim().toLowerCase();

  const productInterests = normalizeTokens(product.interests);
  const productTags = normalizeTokens(product.tags);
  const productOccasions = normalizeTokens(product.occasions);
  const productRelationships = normalizeTokens(product.relationships);
  const productPersonalities = normalizeTokens(product.personalities);
  const productCategory = (product.categoryId || '').trim().toLowerCase();
  const productCategoryName = (product.categoryName || '').trim().toLowerCase();

  // 1. Interest Matching (0.35 weight)
  const allProductInterestTags = new Set([...productInterests, ...productTags]);
  let interestScore = 0.5; // neutral baseline if consultation specified no interests
  let matchedInterests = [];
  if (consultationInterests.length > 0) {
    matchedInterests = consultationInterests.filter((ci) =>
      Array.from(allProductInterestTags).some((pi) => matchesInterestToken(pi, ci))
    );
    // Explicit 0.0 if user specified interests and product matches none;
    // Saturated matching: min(1.0, matched / min(2, total)) so multi-interest profiles are not penalized
    const denominator = Math.min(2, consultationInterests.length);
    interestScore = matchedInterests.length === 0
      ? 0.0
      : Math.min(1.0, matchedInterests.length / denominator);
  }

  // 2. Occasion Matching (0.20 weight)
  let occasionScore = 0.5; // neutral baseline if consultation specified no occasion
  if (consultationOccasion) {
    if (productOccasions.some((po) => matchesOccasionToken(po, consultationOccasion))) {
      occasionScore = 1.0;
    } else if (productOccasions.length === 0) {
      // General/all-season luxury gift
      occasionScore = 0.5;
    } else {
      // Product specifies occasions, but user's occasion is NOT among them
      occasionScore = 0.0;
    }
  }

  // 3. Relationship Matching (0.15 weight)
  let relationshipScore = 0.5; // neutral baseline if consultation specified no relationship
  if (consultationRelationship) {
    if (productRelationships.some((pr) => pr === consultationRelationship || pr.includes(consultationRelationship) || consultationRelationship.includes(pr))) {
      relationshipScore = 1.0;
    } else if (productRelationships.length === 0) {
      // Universally suitable gift
      occasionScore = 0.5;
      relationshipScore = 0.5;
    } else {
      // Product specifies relationships, but user's relationship is NOT among them
      relationshipScore = 0.0;
    }
  }

  // 4. Personality Matching (0.10 weight)
  const allProductPersonalityTags = new Set([...productPersonalities, ...productTags]);
  let personalityScore = 0.5; // neutral baseline if consultation specified no personality
  let matchedPersonalities = [];
  if (consultationPersonalities.length > 0) {
    matchedPersonalities = consultationPersonalities.filter((cp) =>
      Array.from(allProductPersonalityTags).some((pp) => pp === cp || pp.includes(cp) || cp.includes(pp))
    );
    personalityScore = matchedPersonalities.length / consultationPersonalities.length;
  }

  // 5. Budget Proximity (0.10 weight)
  const price = Number(product.price);
  const minBudget = Number(consultation.budget?.min ?? 0);
  const maxBudget = Number(consultation.budget?.max ?? Infinity);
  let budgetScore = 0.8;
  if (maxBudget > 0 && maxBudget !== Infinity) {
    if (price <= maxBudget && price >= minBudget) {
      // Comfortably inside target budget window
      budgetScore = 1.0;
    } else if (price > maxBudget) {
      // Within upper tolerance zone (decays smoothly towards 0.2)
      const toleranceRatio = typeof options.toleranceRatio === 'number' ? options.toleranceRatio : 0.0;
      const tolerance = (maxBudget * toleranceRatio) || 1;
      const overshoot = price - maxBudget;
      budgetScore = Math.max(0.2, 1.0 - (overshoot / tolerance) * 0.8);
    } else {
      budgetScore = 0.0;
    }
  }

  // 6. Category & Desired Emotion Alignment (0.10 weight)
  let categoryScore = 0.5; // neutral baseline
  if (consultationCategories.length > 0) {
    const categoryMatched = consultationCategories.some(
      (cc) => cc === productCategory || cc === productCategoryName || productCategoryName.includes(cc)
    );
    categoryScore = categoryMatched ? 1.0 : 0.0;
  }

  let emotionScore = 0.5; // neutral baseline
  if (desiredEmotion) {
    const emotionTokens = normalizeTokens([
      product.name,
      product.tagline,
      ...(product.tags || []),
      ...(product.personalities || []),
    ]);
    const emotionMatched = emotionTokens.some((et) => et === desiredEmotion || et.includes(desiredEmotion));
    emotionScore = emotionMatched ? 1.0 : 0.1;
  }
  const categoryAndEmotionScore = (categoryScore + emotionScore) / 2;

  // Aggregate weighted score (strictly in [0.0, 1.0])
  const rawScore =
    interestScore * SCORING_WEIGHTS.INTERESTS +
    occasionScore * SCORING_WEIGHTS.OCCASION +
    relationshipScore * SCORING_WEIGHTS.RELATIONSHIP +
    personalityScore * SCORING_WEIGHTS.PERSONALITY +
    budgetScore * SCORING_WEIGHTS.BUDGET_PROXIMITY +
    categoryAndEmotionScore * SCORING_WEIGHTS.CATEGORY_AND_EMOTION;

  // Scale directly to percentage [0, 99] based on actual matching evidence
  const scaledScore = Math.min(99, Math.max(0, Math.round(rawScore * 100)));

  return {
    rawScore,
    scaledScore,
    matchDetails: {
      matchedInterests,
      matchedPersonalities,
      interestScore,
      occasionScore,
      relationshipScore,
      personalityScore,
      budgetScore,
      categoryScore,
      emotionScore,
    },
  };
}

/**
 * Detects whether a product is alcohol-related (barware, wine, whiskey, spirits, decanters).
 */
function isAlcoholProduct(product) {
  const alcoholTokens = new Set([
    'alcohol',
    'whiskey',
    'wine',
    'spirits',
    'barware',
    'decanter',
    'champagne',
    'liquor',
    'cocktail',
    'bourbon',
  ]);
  const tags = normalizeTokens([...(product.tags || []), ...(product.interests || [])]);
  if (tags.some((t) => alcoholTokens.has(t) || Array.from(alcoholTokens).some((a) => t.includes(a)))) {
    return true;
  }
  const name = (product.name || '').toLowerCase();
  return /\b(whiskey|wine|decanter|spirits|barware|liquor|champagne|cocktail)\b/i.test(name);
}

/**
 * Detects whether a product is explicitly an intimate romantic keepsake (e.g. couple star maps, anniversary tokens).
 */
function isIntimateRomanticKeepsake(product) {
  const romanticTokens = new Set([
    'romantic_keepsake',
    'romantic keepsake',
    'couples',
    'couple',
    'anniversary_gift',
    'anniversary gift',
    'romance',
    'romantic',
    'love_token',
    'love token',
    'star_map',
    'star map',
    'love',
  ]);
  const tags = normalizeTokens(product.tags || []);
  const hasRomanticTag = tags.some((t) =>
    romanticTokens.has(t) || romanticTokens.has(t.replace(/_/g, ' ')) || romanticTokens.has(t.replace(/\s+/g, '_'))
  );
  const rels = normalizeTokens(product.relationships || []);
  const hasFormalRel = rels.includes('colleague') || rels.includes('mentor');
  return hasRomanticTag && !hasFormalRel;
}

/**
 * Detects whether a product is a personal body fragrance (perfume, extrait, EDP) applied directly to skin.
 * Distinguishes from neutral living scents (incense, room mist, wellness aromatherapy).
 */
function isPersonalBodyFragrance(product) {
  const cat = (product.categoryId || '').toLowerCase();
  if (cat !== 'artisanal_fragrance' && cat !== 'fragrance') return false;
  const personalTokens = new Set([
    'eau_de_parfum',
    'extrait_de_parfum',
    'personal_fragrance',
    'perfumery',
    'perfume',
    'niche_perfume',
  ]);
  const tags = normalizeTokens(product.tags || []);
  const isPersonalTag = tags.some((t) => personalTokens.has(t));
  const isIncenseOrAromatherapy = tags.some((t) => ['incense', 'aromatherapy', 'sacred_flowers'].includes(t));
  const rels = normalizeTokens(product.relationships || []);
  const hasColleagueRel = rels.includes('colleague') || rels.includes('mentor');
  return isPersonalTag && !isIncenseOrAromatherapy && !hasColleagueRel;
}

/**
 * Detects whether a consultation context represents a formal or institutional setting.
 */
function isFormalContext(consultation) {
  const rel = (consultation.relationship || '').trim().toLowerCase();
  const name = (consultation.recipientName || '').trim();

  // Explicitly intimate relationships are never formal contexts
  const intimateRels = new Set(['partner', 'spouse', 'mother', 'father', 'sister', 'brother', 'best_friend']);
  if (intimateRels.has(rel)) {
    return false;
  }

  // Explicit professional relationships
  const professionalRels = new Set(['colleague', 'mentor', 'client', 'manager', 'teacher', 'boss', 'professional']);
  if (professionalRels.has(rel)) {
    return true;
  }

  // Professional/formal titles or honorifics in recipientName
  const formalTitleRegex = /\b(justice|judges?|honorable|hon\b|magistrates?|professors?|prof\b|deans?|dr\b|doctors?|clients?|directors?|vp|executives?|ministers?|counsels?)\b/i;
  if (formalTitleRegex.test(name)) {
    return true;
  }

  return false;
}

/**
 * Checks whether user explicitly requested a specific category/attribute in interests.
 */
function userExplicitlyRequested(consultation, tokens) {
  const userInterests = normalizeTokens(consultation.interests || []);
  const targetTokens = new Set(tokens.map((t) => t.toLowerCase()));
  return userInterests.some((ui) =>
    targetTokens.has(ui) || Array.from(targetTokens).some((tt) => ui.includes(tt) || tt.includes(ui))
  );
}

/**
 * Evaluates contextual suitability between a product and consultation context.
 */
function evaluateContextualSuitability(product, consultation) {
  const isFormal = isFormalContext(consultation);

  if (isFormal) {
    // 1. Alcohol check: disqualified by default in formal/institutional context
    if (isAlcoholProduct(product)) {
      const alcoholAllowed = userExplicitlyRequested(consultation, [
        'alcohol',
        'whiskey',
        'wine',
        'spirits',
        'barware',
        'decanter',
      ]);
      if (!alcoholAllowed) {
        return {
          suitable: false,
          reason: 'Alcohol-related products are disqualified by default in formal or institutional gifting contexts without explicit user request.',
        };
      }
    }

    // 2. Intimate romantic keepsakes: disqualified in formal/institutional context
    if (isIntimateRomanticKeepsake(product)) {
      return {
        suitable: false,
        reason: 'Intimate romantic keepsakes are disqualified in formal or institutional professional contexts.',
      };
    }

    // 3. Personal body fragrances: disqualified by default for formal authorities
    if (isPersonalBodyFragrance(product)) {
      const fragranceAllowed = userExplicitlyRequested(consultation, [
        'perfumes',
        'perfume',
        'niche_fragrance',
        'fragrance',
        'scents',
      ]);
      if (!fragranceAllowed) {
        return {
          suitable: false,
          reason: 'Personal wearable fragrances are discouraged in formal institutional contexts unless explicitly requested.',
        };
      }
    }
  }

  return { suitable: true };
}

/**
 * Minimum Relevance Gate:
 * Ensures products with 0 matching interests are not returned merely due to budget/generic occasion tags.
 */
function evaluateInterestGate(product, consultation, matchedInterests) {
  const consultationInterests = normalizeTokens(consultation.interests);
  if (consultationInterests.length === 0) {
    // No interests selected: gate passes, falling back to remaining profile dimensions
    return { passed: true, reason: 'No interests specified; fallback to remaining profile dimensions' };
  }

  if (matchedInterests.length > 0) {
    return { passed: true, reason: `Matched ${matchedInterests.length} interest(s)` };
  }

  // Check for genuine explicit category match (ignoring client hardcoded mock default)
  const rawCategories = Array.isArray(consultation.productCategories) ? consultation.productCategories : [];
  const isMockDefault = rawCategories.length === 2 &&
    rawCategories.includes('wearables_eyewear') &&
    rawCategories.includes('curated_boxes');

  if (!isMockDefault && rawCategories.length > 0) {
    const normCategories = normalizeTokens(rawCategories);
    const prodCat = (product.categoryId || '').toLowerCase();
    const prodCatName = (product.categoryName || '').toLowerCase();
    if (normCategories.some((c) => c === prodCat || c === prodCatName || prodCatName.includes(c))) {
      return { passed: true, reason: 'Explicit category selection match' };
    }
  }

  return {
    passed: false,
    reason: 'Product matched zero selected interests and has no explicit category qualification',
  };
}

/**
 * Generates an authentically grounded recommendation rationale.
 *
 * Grounding Invariants:
 * - Every claim is strictly backed by genuine catalogue fields.
 * - Does not claim "verified" unless product.retailer?.verified === true.
 * - Does not claim "artisan" or "handmade" unless present in product data.
 * - Mentions interests only when actually matched with consultation.
 * - Handles missing metadata gracefully with neutral, honest phrasing.
 *
 * @param {Object} product - Product document
 * @param {Object} consultation - Consultation document
 * @param {Object} matchDetails - Matched attribute details from scoring
 * @returns {string} Grounded rationale text
 */
function generateDynamicRationale(product, consultation, matchDetails = {}) {
  const recipient = (consultation.recipientName || 'your recipient').trim();
  const rawRelationship = (consultation.relationship || '').trim();
  const relationship = formatReadableToken(rawRelationship);
  const rawOccasion = (consultation.occasion || '').trim();
  const occasion = formatReadableToken(rawOccasion);
  const rawEmotion = (consultation.desiredEmotion || '').trim();
  const emotion = formatReadableToken(rawEmotion);

  // 1. Recipient and relationship opening
  let opening = '';
  if (relationship) {
    const recipientLower = recipient.toLowerCase();
    const relLower = relationship.toLowerCase();
    const alreadyParenthesized = /\([^)]+\)/.test(recipient);
    const mentionsRel = recipientLower.includes(relLower) ||
      (relLower === 'mother' && (recipientLower.includes('mom') || recipientLower.includes('mum'))) ||
      (relLower === 'father' && (recipientLower.includes('dad') || recipientLower.includes('papa'))) ||
      (relLower === 'partner' && (recipientLower.includes('spouse') || recipientLower.includes('wife') || recipientLower.includes('husband')));

    if (alreadyParenthesized || mentionsRel) {
      opening = `Selected for ${recipient}.`;
    } else {
      opening = `Selected for ${recipient} (${relLower}).`;
    }
  } else {
    opening = `Selected for ${recipient}.`;
  }

  // 2. Occasion and sentiment framing (only when supported by product metadata)
  let occasionClause = '';
  const productOccasions = normalizeTokens(product.occasions || []);
  const normOccasion = rawOccasion.toLowerCase();
  const occasionLower = occasion.toLowerCase();
  const matchesOccasion = normOccasion && productOccasions.some((po) => matchesOccasionToken(po, rawOccasion));
  const matchesEmotion = matchDetails.emotionScore !== undefined ? matchDetails.emotionScore >= 0.5 : false;

  const emotionLower = emotion.toLowerCase();
  if (matchesOccasion && matchesEmotion && emotion) {
    occasionClause = `Suited for their ${occasionLower} to express genuine ${emotionLower}.`;
  } else if (matchesOccasion && occasion) {
    occasionClause = `Suited for their ${occasionLower} celebration.`;
  } else if (matchesEmotion && emotion) {
    occasionClause = `Curated to convey heartfelt ${emotionLower}.`;
  }

  // 3. Product feature grounding (strict verification against product data)
  let featureClause = '';
  const categoryDisplay = (product.categoryName || product.name || 'item').trim();
  const matchedInterests = (matchDetails.matchedInterests || [])
    .map(formatReadableToken)
    .filter(Boolean);

  if (matchedInterests.length > 0) {
    const interestStr = matchedInterests.slice(0, 2).join(' and ');
    featureClause = `Aligns with their interest in ${interestStr}`;
  } else if (matchesOccasion && occasion) {
    featureClause = `Features distinctive ${categoryDisplay.toLowerCase()} curated for this milestone`;
  } else {
    featureClause = `Features distinctive ${categoryDisplay.toLowerCase()}`;
  }

  // 4. Source & Retailer grounding (only claims "verified" when explicitly true)
  let sourceClause = '.';
  const retailerName = product.retailer?.name ? product.retailer.name.trim() : '';
  const isVerified = product.retailer?.verified === true;

  if (retailerName && isVerified) {
    sourceClause = ` from verified retailer ${retailerName}.`;
  } else if (retailerName) {
    sourceClause = ` from ${retailerName}.`;
  }

  return `${opening} ${occasionClause} ${featureClause}${sourceClause}`.replace(/\s+/g, ' ').trim();
}

/**
 * Safely extracts a normalized brand key from a product.
 * Gracefully handles missing, undefined, null, or empty brand/retailer fields.
 *
 * @param {Object} product
 * @returns {string}
 */
function getProductBrandKey(product) {
  if (!product) return 'unknown';
  const rawBrand = product.brand || product.retailer?.name || product.retailerName || '';
  if (typeof rawBrand !== 'string' || !rawBrand.trim()) {
    return 'unknown';
  }
  return normalizeTokenText(rawBrand);
}

/**
 * Extracts a narrow product type key using existing catalogue metadata (categoryName, categoryId, tags).
 * Differentiates narrow product families (e.g. pens vs bookmarks, candles vs perfumes)
 * without discarding products sharing a broad category.
 *
 * @param {Object} product
 * @returns {string}
 */
function getProductNarrowType(product) {
  if (!product) return 'general';

  const catName = normalizeTokenText(product.categoryName);
  const catId = normalizeTokenText(product.categoryId);
  const tags = Array.isArray(product.tags)
    ? product.tags.map((t) => (typeof t === 'string' ? normalizeTokenText(t) : '')).filter(Boolean)
    : [];

  // Pens / Writing Instruments
  if (tags.some((t) => t.includes('pen') || t === 'rollerball' || t === 'fountain pen') || catName.includes('writing instrument')) {
    return 'writing_instruments:pens';
  }
  // Bookmarks / Literary Keepsakes
  if (tags.some((t) => t.includes('bookmark')) || catName.includes('literary keepsake')) {
    return 'fine_stationery:bookmarks';
  }
  // Scented Candles
  if (tags.some((t) => t.includes('candle')) || catName.includes('candle')) {
    return 'fragrance:candles';
  }
  // Incense
  if (tags.some((t) => t.includes('incense')) || catName.includes('incense')) {
    return 'fragrance:incense';
  }
  // Perfumes
  if (tags.some((t) => t.includes('perfume') || t.includes('extrait') || t.includes('attar')) || catName.includes('perfumery')) {
    return 'fragrance:perfumes';
  }
  // Star Maps / Celestial Keepsakes
  if (tags.some((t) => t.includes('star map') || t.includes('astronomical')) || catName.includes('custom art')) {
    return 'keepsakes:star_maps';
  }
  // Board Games / Chess
  if (tags.some((t) => t.includes('chess') || t.includes('board game')) || catName.includes('artisan game')) {
    return 'keepsakes:games';
  }
  // Barware / Crystal / Decanters
  if (tags.some((t) => t.includes('decanter') || t.includes('whiskey') || t.includes('crystal barware')) || catName.includes('crystal barware')) {
    return 'keepsakes:barware';
  }
  // Tea
  if (tags.some((t) => t.includes('tea')) || catName.includes('fine tea')) {
    return 'gourmet:tea';
  }
  // Chocolates
  if (tags.some((t) => t.includes('chocolate')) || catName.includes('chocolate')) {
    return 'gourmet:chocolates';
  }
  // Coffee
  if (tags.some((t) => t.includes('coffee')) || catName.includes('coffee')) {
    return 'gourmet:coffee';
  }
  // Smart Watches / Timepieces
  if (tags.some((t) => t.includes('watch') || t.includes('chronograph') || t.includes('horology')) || catName.includes('horology')) {
    return 'horology:watches';
  }
  // Clocks
  if (tags.some((t) => t.includes('clock'))) {
    return 'horology:clocks';
  }
  // Smart Rings
  if (tags.some((t) => t.includes('smart ring') || t.includes('ring'))) {
    return 'wearables:rings';
  }
  // Eyewear / Sunglasses
  if (tags.some((t) => t.includes('sunglasses') || t.includes('glasses') || t.includes('eyewear')) || catName.includes('eyewear')) {
    return 'wearables:eyewear';
  }

  // Fallback: categoryName or categoryId
  return catName || catId || 'general';
}

/**
 * Applies deterministic brand and product similarity diversity to scored recommendation items.
 *
 * Requirements:
 * - Maximum 2 products from the same brand in top recommendations when sufficient alternatives exist.
 * - Maximum 2 products from the same narrow product type when alternatives exist.
 * - If fewer than 3 eligible brands/products are available, allow additional products from the same brand.
 * - Preserves original score, rawScore, and rationale for every product.
 * - 100% deterministic ordering.
 *
 * @param {Array<{ product: Object, score: number, rawScore: number, rationale: string }>} scoredItems
 * @param {number} maxResults
 * @returns {Array<{ product: Object, score: number, rawScore: number, rationale: string }>}
 */
function applyRecommendationDiversity(scoredItems, maxResults = 12) {
  if (!Array.isArray(scoredItems) || scoredItems.length <= 1) {
    return scoredItems || [];
  }

  const MAX_PER_BRAND = 2;
  const MAX_PER_TYPE = 2;

  const brandCounts = new Map();
  const typeCounts = new Map();

  const selected = [];
  const deferred = [];

  // Pass 1: Select items respecting both brand cap (2) and narrow product type cap (2)
  for (const item of scoredItems) {
    const brandKey = getProductBrandKey(item.product);
    const typeKey = getProductNarrowType(item.product);

    const currentBrandCount = brandCounts.get(brandKey) || 0;
    const currentTypeCount = typeCounts.get(typeKey) || 0;

    if (currentBrandCount < MAX_PER_BRAND && currentTypeCount < MAX_PER_TYPE) {
      selected.push(item);
      brandCounts.set(brandKey, currentBrandCount + 1);
      typeCounts.set(typeKey, currentTypeCount + 1);
      if (selected.length >= maxResults) {
        break;
      }
    } else {
      deferred.push(item);
    }
  }

  // Pass 2: If available slots remain, relax narrow type limit first (while still respecting brand limit)
  if (selected.length < maxResults && deferred.length > 0) {
    const stillDeferred = [];
    for (const item of deferred) {
      if (selected.length >= maxResults) {
        stillDeferred.push(item);
        continue;
      }
      const brandKey = getProductBrandKey(item.product);
      const currentBrandCount = brandCounts.get(brandKey) || 0;

      if (currentBrandCount < MAX_PER_BRAND) {
        selected.push(item);
        brandCounts.set(brandKey, currentBrandCount + 1);
      } else {
        stillDeferred.push(item);
      }
    }

    // Pass 3: If slots still remain (insufficient alternative brands), relax brand limit completely
    for (const item of stillDeferred) {
      if (selected.length >= maxResults) break;
      selected.push(item);
    }
  }

  return selected;
}

/**
 * Primary Service Interface:
 * Generates grounded, deterministically ranked recommendations from real MongoDB catalogue products.
 *
 * @param {Object} consultation - Persisted consultation document
 * @param {Object} [options] - Options: { toleranceRatio, minRelevanceScore, maxResults }
 * @returns {Promise<{ items: Array, totalActive: number, eligibleCount: number, message: string }>}
 */
async function generateGroundedRecommendations(consultation, options = {}) {
  if (!consultation) {
    throw new Error('A valid persisted consultation profile is required.');
  }

  const exclusions = Array.isArray(consultation.exclusions) ? consultation.exclusions : [];
  const budget = consultation.budget || { min: 500, max: 3500, currency: 'INR' };
  // Default tolerance is 0.0 (strict budget adherence)
  const toleranceRatio = typeof options.toleranceRatio === 'number' && options.toleranceRatio >= 0
    ? options.toleranceRatio
    : 0.0;
  // Minimum relevance threshold (default 0.20 / 20%)
  const minRelevanceThreshold = typeof options.minRelevanceScore === 'number'
    ? options.minRelevanceScore
    : DEFAULT_MIN_RELEVANCE_THRESHOLD;
  const maxResults = typeof options.maxResults === 'number' ? options.maxResults : 12;

  // 1. Retrieve ONLY real active products from MongoDB (lean for zero-overhead serialization)
  const productQuery = Product.find({ active: true });
  const activeProducts = typeof productQuery.lean === 'function'
    ? await productQuery.lean().exec()
    : await productQuery;
  const totalActive = activeProducts.length;

  if (totalActive === 0) {
    return {
      items: [],
      totalActive: 0,
      eligibleCount: 0,
      message: 'No active products found in the catalogue database.',
    };
  }

  // 2. Apply Hard Filters: Exclusions & Budget/Currency
  const eligibleCandidates = [];
  for (const product of activeProducts) {
    // A. Check Exclusions
    if (isProductExcluded(product, exclusions)) {
      continue;
    }

    // B. Check Budget & Currency
    const budgetCheck = evaluateBudgetEligibility(product, budget, { toleranceRatio });
    if (!budgetCheck.eligible) {
      continue;
    }

    eligibleCandidates.push(product);
  }

  // 3. Deterministic Scoring & Rationale Generation with Contextual Guardrails
  const scoredItems = [];
  for (const product of eligibleCandidates) {
    // A. Contextual Suitability Guardrail (disqualifies formal mismatches e.g. alcohol/intimate keepsakes)
    const suitability = evaluateContextualSuitability(product, consultation);
    if (!suitability.suitable) {
      continue;
    }

    // B. Multi-Factor Deterministic Relevance Scoring
    const { rawScore, scaledScore, matchDetails } = calculateRelevanceScore(product, consultation, { toleranceRatio });

    // C. Minimum Relevance Interest Gate (prunes zero-interest matches when interests are specified)
    const interestGate = evaluateInterestGate(product, consultation, matchDetails.matchedInterests || []);
    if (!interestGate.passed) {
      continue;
    }

    // D. Apply minimum relevance filter to prune weak recommendations
    if (rawScore < minRelevanceThreshold) {
      continue;
    }

    // E. Dynamic Grounded Rationale Generation
    const rationale = generateDynamicRationale(product, consultation, matchDetails);

    scoredItems.push({
      product,
      score: scaledScore,
      rawScore,
      rationale,
    });
  }

  const eligibleCount = scoredItems.length;

  // Return honest empty result if no products satisfied constraints or relevance threshold
  if (eligibleCount === 0) {
    return {
      items: [],
      totalActive,
      eligibleCount: 0,
      message: 'No active products matched the consultation criteria with sufficient relevance.',
    };
  }

  // 4. Deterministic Multi-Level Tie-Breaking
  scoredItems.sort((a, b) => {
    // Primary: Displayed score (higher first)
    if (b.score !== a.score) return b.score - a.score;

    // Secondary: Raw unrounded score (higher first)
    if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;

    // Tertiary: Product rating (higher first)
    const ratingA = Number(a.product.rating || 5.0);
    const ratingB = Number(b.product.rating || 5.0);
    if (ratingB !== ratingA) return ratingB - ratingA;

    // Quaternary: Review count (higher first)
    const reviewsA = Number(a.product.reviewCount || 0);
    const reviewsB = Number(b.product.reviewCount || 0);
    if (reviewsB !== reviewsA) return reviewsB - reviewsA;

    // Quinquenary: Deterministic ID comparison
    const idA = a.product._id ? a.product._id.toString() : '';
    const idB = b.product._id ? b.product._id.toString() : '';
    return idA.localeCompare(idB);
  });

  // 5. Apply brand and narrow product type diversity (post-scoring)
  const diversifiedItems = applyRecommendationDiversity(scoredItems, maxResults);

  // 6. Slice to requested limit and normalize returned item payload
  const finalItems = diversifiedItems.slice(0, maxResults).map(({ product, score, rationale }) => ({
    product,
    score,
    rationale,
  }));

  return {
    items: finalItems,
    totalActive,
    eligibleCount,
    message: 'Recommendations generated successfully from database.',
  };
}

module.exports = {
  SCORING_WEIGHTS,
  DEFAULT_MIN_RELEVANCE_THRESHOLD,
  EXCLUSION_ALIASES,
  INTEREST_ALIASES,
  INTEREST_ALIAS_INDEX,
  OCCASION_ALIASES,
  OCCASION_ALIAS_INDEX,
  formatReadableToken,
  matchesOccasionToken,
  getProductBrandKey,
  getProductNarrowType,
  applyRecommendationDiversity,
  isProductExcluded,
  evaluateBudgetEligibility,
  calculateRelevanceScore,
  generateDynamicRationale,
  generateGroundedRecommendations,
  // Contextual suitability and relevance guardrail exports
  isFormalContext,
  isAlcoholProduct,
  isIntimateRomanticKeepsake,
  isPersonalBodyFragrance,
  evaluateContextualSuitability,
  evaluateInterestGate,
  matchesInterestToken,
};
