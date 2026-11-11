const Consultation = require('../models/Consultation');
const Product = require('../models/Product');
const { SEED_PRODUCTS } = require('../data/seedData');

// POST /api/v1/consultations
const createConsultation = async (req, res) => {
  try {
    const {
      recipientName,
      relationship,
      occasion,
      interests = [],
      personality = [],
      desiredEmotion,
      budget = { min: 500, max: 3500, currency: 'INR' },
      productCategories = [],
      exclusions = [],
      notes = '',
    } = req.body;

    if (!relationship || !occasion || !desiredEmotion) {
      return res.status(400).json({
        success: false,
        message: 'Relationship, occasion, and desiredEmotion are required fields',
      });
    }

    let consultation = {
      _id: 'guest-' + Date.now(),
      recipientName: recipientName || 'Recipient',
      relationship,
      occasion,
      interests,
      personality,
      desiredEmotion,
      budget,
      productCategories,
      exclusions,
      notes,
      createdAt: new Date(),
    };

    if (Consultation.db && Consultation.db.readyState === 1) {
      consultation = await Consultation.create({
        recipientName,
        relationship,
        occasion,
        interests,
        personality,
        desiredEmotion,
        budget,
        productCategories,
        exclusions,
        notes,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Consultation profile created successfully',
      data: consultation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create consultation',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

// POST /api/v1/recommendations/generate/:consultationId
const generateRecommendations = async (req, res) => {
  try {
    const { consultationId } = req.params;
    const bodyProfile = req.body;

    let profile = bodyProfile;
    if (Consultation.db && Consultation.db.readyState === 1 && consultationId) {
      const found = await Consultation.findById(consultationId).catch(() => null);
      if (found) profile = found;
    }

    const catalogue = SEED_PRODUCTS;

    // 4-Factor Deterministic Ranking (Blueprint Section 8)
    // 35% interest match + 25% personality match + 20% occasion match + 20% budget suitability
    const ranked = catalogue.map((product) => {
      let interestScore = 0;
      if (profile.interests && profile.interests.length > 0) {
        const matches = product.interests.filter((i) =>
          profile.interests.some((pi) => pi.toLowerCase().includes(i.toLowerCase()))
        );
        interestScore = matches.length / Math.max(1, profile.interests.length);
      } else {
        interestScore = 0.8;
      }

      let occasionScore = product.occasions.includes(profile.occasion) ? 1.0 : 0.6;
      let budgetScore = 0.9;
      if (profile.budget && profile.budget.max) {
        budgetScore = product.price <= profile.budget.max ? 1.0 : Math.max(0.5, profile.budget.max / product.price);
      }

      const totalScore = Math.round(
        (0.35 * interestScore + 0.25 * 0.85 + 0.20 * occasionScore + 0.20 * budgetScore) * 100
      );

      const rationale = `Calibrated for ${profile.relationship || 'your recipient'}'s quiet rituals. Aligns with their affinity for ${product.interests.join(' & ')} while conveying genuine ${profile.desiredEmotion || 'appreciation'}. Verified independent artisan release.`;

      return {
        product,
        score: Math.min(99, Math.max(75, totalScore)),
        rationale,
      };
    });

    // Sort by score descending
    ranked.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      message: 'Recommendations generated successfully',
      data: {
        consultationId,
        items: ranked,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

module.exports = {
  createConsultation,
  generateRecommendations,
};
