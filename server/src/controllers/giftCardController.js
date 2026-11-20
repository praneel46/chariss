const mongoose = require('mongoose');
const GiftCard = require('../models/GiftCard');
const {
  getOrCreateGuestSession,
  getGuestTokenFromRequest,
  hashGuestToken,
  verifyGuestRecordOwnership,
} = require('../utils/guestSessionUtils');

const TEMPLATES = [
  {
    id: 'tmpl-01',
    name: 'Minimal Warm Botanical',
    theme: 'minimal_floral',
    borderColor: '#DCCFC1',
    textColor: '#292820',
    fontFamily: 'serif',
    stampIcon: '🌿',
  },
  {
    id: 'tmpl-02',
    name: 'Modern Editorial Sans',
    theme: 'modern_typography',
    borderColor: '#292820',
    textColor: '#151419',
    fontFamily: 'sans',
    stampIcon: '✦',
  },
  {
    id: 'tmpl-03',
    name: 'Warm Rose Sentiment',
    theme: 'warm_editorial',
    borderColor: '#E9D9DD',
    textColor: '#292820',
    fontFamily: 'handwriting',
    stampIcon: '💌',
  },
  {
    id: 'tmpl-04',
    name: 'Dark Noir Keepsake',
    theme: 'quiet_luxury',
    borderColor: '#B69A78',
    textColor: '#FAF9F6',
    fontFamily: 'serif',
    stampIcon: '⚜',
  },
];

const ALLOWED_UPDATE_FIELDS = [
  'recipientName',
  'senderName',
  'occasion',
  'templateId',
  'message',
  'tone',
  'alignment',
  'fontSize',
  'designSettings',
  'imageUrl',
];

/**
 * Sanitizes gift card documents so internal session hashes are never leaked.
 */
function sanitizeGiftCard(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.guestSessionHash;
  delete obj.guestSessionExpiresAt;
  return obj;
}

/**
 * GET /api/v1/gift-cards/templates
 * Public: retrieves available gift card templates.
 */
const getTemplates = (req, res) => {
  res.json({
    success: true,
    message: 'Card templates retrieved',
    data: TEMPLATES,
  });
};

/**
 * POST /api/v1/gift-cards
 * Creates a gift card:
 * - Authenticated: userId derived exclusively from req.user.id.
 * - Guest: userId is null, secure HTTP-only session cookie set, SHA-256 hash stored.
 */
const createGiftCard = async (req, res) => {
  try {
    const {
      recipientName,
      senderName,
      occasion,
      templateId,
      message,
      tone,
      alignment,
      fontSize,
      designSettings,
      imageUrl,
    } = req.body;

    let resolvedUserId = null;
    let resolvedGuestSessionHash = null;
    let resolvedGuestExpiresAt = null;

    if (req.user) {
      resolvedUserId = req.user.id;
    } else {
      const { tokenHash, expiresAt } = getOrCreateGuestSession(req, res);
      resolvedGuestSessionHash = tokenHash;
      resolvedGuestExpiresAt = expiresAt;
    }

    const card = await GiftCard.create({
      userId: resolvedUserId,
      guestSessionHash: resolvedGuestSessionHash,
      guestSessionExpiresAt: resolvedGuestExpiresAt,
      recipientName: recipientName || '',
      senderName: senderName || '',
      occasion: occasion || 'General',
      templateId,
      message,
      tone: tone || 'heartfelt',
      alignment: alignment || 'center',
      fontSize: fontSize || 'md',
      designSettings: designSettings || {},
      imageUrl: imageUrl || null,
    });

    res.status(201).json({
      success: true,
      message: 'Gift card created and persisted to database successfully',
      data: sanitizeGiftCard(card),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create gift card in database',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * GET /api/v1/gift-cards
 * Lists gift cards:
 * - If authenticated: returns cards owned by req.user.id.
 * - If guest with valid session cookie: returns cards owned by that guest session.
 * - Otherwise: requires authentication (401).
 */
const getGiftCards = async (req, res) => {
  try {
    if (req.user) {
      const cards = await GiftCard.find({ userId: req.user.id }).sort({
        createdAt: -1,
      });
      return res.json({
        success: true,
        message: 'Gift cards retrieved successfully',
        data: cards.map(sanitizeGiftCard),
      });
    }

    const guestToken = getGuestTokenFromRequest(req);
    if (!guestToken) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No session or access token provided.',
        code: 'AUTH_REQUIRED',
      });
    }

    const tokenHash = hashGuestToken(guestToken);
    const guestCards = await GiftCard.find({
      userId: null,
      guestSessionHash: tokenHash,
      guestSessionExpiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Guest gift cards retrieved successfully',
      data: guestCards.map(sanitizeGiftCard),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve gift cards',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * GET /api/v1/gift-cards/:id
 * Retrieves a single gift card with ownership check.
 */
const getGiftCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await GiftCard.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found',
        code: 'NOT_FOUND',
      });
    }

    // 1. Authenticated ownership check
    if (card.userId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to access this gift card',
          code: 'AUTH_REQUIRED',
        });
      }

      if (card.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this gift card',
          code: 'FORBIDDEN',
        });
      }
    } else {
      // 2. Guest ownership check
      const authResult = verifyGuestRecordOwnership(card, req);
      if (!authResult.allowed) {
        return res.status(authResult.status).json({
          success: false,
          message: authResult.message,
          code: authResult.code,
        });
      }
    }

    res.json({
      success: true,
      data: sanitizeGiftCard(card),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve gift card',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * PUT /api/v1/gift-cards/:id
 * Updates or claims a gift card with ownership check.
 */
const updateGiftCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await GiftCard.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found',
        code: 'NOT_FOUND',
      });
    }

    const updates = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 1. User-owned card update
    if (card.userId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to modify this gift card',
          code: 'AUTH_REQUIRED',
        });
      }

      if (card.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this gift card',
          code: 'FORBIDDEN',
        });
      }

      Object.assign(card, updates);
      await card.save();

      return res.json({
        success: true,
        message: 'Gift card updated successfully',
        data: sanitizeGiftCard(card),
      });
    }

    // 2. Guest-owned card update: requires session proof
    const authResult = verifyGuestRecordOwnership(card, req);
    if (!authResult.allowed) {
      return res.status(authResult.status).json({
        success: false,
        message: authResult.message,
        code: authResult.code,
      });
    }

    // 2A. Authenticated claiming flow: requires proof of guest session
    if (req.user) {
      const claimed = await GiftCard.findOneAndUpdate(
        {
          _id: id,
          userId: null,
          guestSessionHash: authResult.tokenHash,
          guestSessionExpiresAt: { $gt: new Date() },
        },
        {
          $set: {
            userId: req.user.id,
            guestSessionHash: null,
            guestSessionExpiresAt: null,
            ...updates,
          },
        },
        { new: true }
      );

      if (!claimed) {
        return res.status(403).json({
          success: false,
          message: 'Unable to claim gift card: session mismatch or already claimed',
          code: 'CLAIM_FAILED',
        });
      }

      return res.json({
        success: true,
        message: 'Gift card claimed and linked to your account successfully',
        data: sanitizeGiftCard(claimed),
      });
    }

    // 2B. Normal guest update
    Object.assign(card, updates);
    await card.save();

    res.json({
      success: true,
      message: 'Gift card updated successfully',
      data: sanitizeGiftCard(card),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update gift card',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * DELETE /api/v1/gift-cards/:id
 * Deletes a gift card with ownership check.
 */
const deleteGiftCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await GiftCard.findById(id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Gift card not found',
        code: 'NOT_FOUND',
      });
    }

    // 1. User-owned card delete
    if (card.userId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to delete this gift card',
          code: 'AUTH_REQUIRED',
        });
      }

      if (card.userId.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this gift card',
          code: 'FORBIDDEN',
        });
      }

      await GiftCard.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: 'Gift card deleted successfully',
      });
    }

    // 2. Guest-owned card delete
    if (req.user && req.user.role === 'admin') {
      await GiftCard.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: 'Gift card deleted by administrator',
      });
    }

    const authResult = verifyGuestRecordOwnership(card, req);
    if (!authResult.allowed) {
      return res.status(authResult.status).json({
        success: false,
        message: authResult.message,
        code: authResult.code,
      });
    }

    await GiftCard.findOneAndDelete({
      _id: id,
      userId: null,
      guestSessionHash: authResult.tokenHash,
    });

    res.json({
      success: true,
      message: 'Guest gift card deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete gift card',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

module.exports = {
  getTemplates,
  createGiftCard,
  getGiftCards,
  getGiftCardById,
  updateGiftCard,
  deleteGiftCard,
};
