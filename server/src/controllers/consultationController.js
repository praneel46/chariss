const crypto = require('crypto');
const mongoose = require('mongoose');
const Consultation = require('../models/Consultation');
const Product = require('../models/Product');
const recommendationService = require('../services/recommendationService');
const {
  getOrCreateGuestSession,
  getGuestTokenFromRequest,
  hashGuestToken,
  verifyGuestRecordOwnership,
} = require('../utils/guestSessionUtils');

const ALLOWED_UPDATE_FIELDS = [
  'recipientName',
  'relationship',
  'occasion',
  'interests',
  'personality',
  'desiredEmotion',
  'budget',
  'productCategories',
  'exclusions',
  'notes',
  'status',
];

/**
 * Computes a deterministic SHA-256 hash of the consultation submission payload
 * to verify payload integrity during idempotent retries.
 * Strictly excludes ownership, session, and idempotency key fields.
 */
function hashPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return crypto.createHash('sha256').update('').digest('hex');
  }

  const normalizeStringArray = (arr) =>
    Array.isArray(arr)
      ? [...arr].map((s) => String(s).trim()).filter(Boolean).sort()
      : [];

  const normalized = {
    recipientName: (payload.recipientName ? String(payload.recipientName) : 'Recipient').trim(),
    relationship: (payload.relationship ? String(payload.relationship) : '').trim(),
    occasion: (payload.occasion ? String(payload.occasion) : '').trim(),
    interests: normalizeStringArray(payload.interests),
    personality: normalizeStringArray(payload.personality),
    desiredEmotion: (payload.desiredEmotion ? String(payload.desiredEmotion) : '').trim(),
    budget: {
      min: Number(payload.budget?.min ?? 500),
      max: Number(payload.budget?.max ?? 3500),
      currency: String(payload.budget?.currency || 'INR').trim().toUpperCase(),
    },
    productCategories: normalizeStringArray(payload.productCategories),
    exclusions: normalizeStringArray(payload.exclusions),
    notes: (payload.notes ? String(payload.notes) : '').trim(),
    status: String(payload.status || 'completed').trim().toLowerCase(),
  };

  return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex');
}

/**
 * Sanitizes consultation documents so internal session hashes are never leaked in API JSON responses.
 */
function sanitizeConsultation(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.guestSessionHash;
  delete obj.guestSessionExpiresAt;
  delete obj.requestPayloadHash;
  return obj;
}

/**
 * Fast-fails when persistent MongoDB connection is not ready and not under test harness stubs
 */
function assertDatabaseReady(res) {
  if (
    mongoose.connection.readyState !== 1 &&
    !Object.prototype.hasOwnProperty.call(Consultation, 'create')
  ) {
    res.status(503).json({
      success: false,
      message: 'Database service is currently unavailable. Please verify MongoDB Atlas connection and IP whitelist.',
      code: 'DATABASE_UNAVAILABLE',
    });
    return false;
  }
  return true;
}

/**
 * POST /api/v1/consultations
 * Creates a consultation profile.
 * - Supports server-side idempotency via 'Idempotency-Key' header or body field.
 * - Idempotency is strictly scoped by user identity or guest session.
 * - Authenticated: userId derived exclusively from req.user.id.
 * - Guest: userId is null, secure HTTP-only session cookie is set, SHA-256 hash stored.
 * - Client-supplied ownership and session fields are strictly forbidden.
 */
const createConsultation = async (req, res) => {
  if (!assertDatabaseReady(res)) return;

  const headerKey = (
    req.headers['idempotency-key'] ||
    req.headers['x-idempotency-key'] ||
    ''
  ).toString().trim() || null;

  const bodyKey = (req.body && req.body.idempotencyKey ? String(req.body.idempotencyKey).trim() : null);

  // If both header and body keys are provided, they must match
  if (headerKey && bodyKey && headerKey !== bodyKey) {
    return res.status(400).json({
      success: false,
      message: 'Conflicting idempotency keys provided: Idempotency-Key header and body idempotencyKey do not match.',
      code: 'IDEMPOTENCY_KEY_MISMATCH',
    });
  }

  const idempotencyKey = headerKey || bodyKey || null;

  // Validate format and length of the resolved key
  if (idempotencyKey) {
    if (idempotencyKey.length > 128 || !/^[\w\-.:]+$/.test(idempotencyKey)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid idempotency key format: must be between 1 and 128 characters and contain only alphanumeric characters, dashes, dots, or colons.',
        code: 'INVALID_IDEMPOTENCY_KEY',
      });
    }
  }

  let resolvedUserId = null;
  let resolvedGuestSessionHash = null;
  let resolvedGuestExpiresAt = null;
  let payloadHash = null;

  try {
    const {
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
      status,
    } = req.body;

    if (req.user) {
      resolvedUserId = req.user.id;
    } else {
      // Issue/reuse cryptographic guest session delivered via HTTP-only cookie
      const { tokenHash, expiresAt } = getOrCreateGuestSession(req, res);
      resolvedGuestSessionHash = tokenHash;
      resolvedGuestExpiresAt = expiresAt;
    }

    if (idempotencyKey) {
      payloadHash = hashPayload(req.body);

      // Check for existing submission scoped strictly to the current caller's identity
      const ownershipQuery = resolvedUserId
        ? { userId: resolvedUserId, idempotencyKey }
        : { guestSessionHash: resolvedGuestSessionHash, idempotencyKey };

      const existing = await Consultation.findOne(ownershipQuery);
      if (existing) {
        // Verify that payload matches the original submission
        if (existing.requestPayloadHash && existing.requestPayloadHash !== payloadHash) {
          return res.status(409).json({
            success: false,
            message: 'Idempotency conflict: A consultation already exists with this idempotency key but with different submission parameters.',
            code: 'IDEMPOTENCY_CONFLICT',
          });
        }

        return res.status(200).json({
          success: true,
          message: 'Consultation retrieved from existing idempotent submission',
          data: sanitizeConsultation(existing),
        });
      }
    }

    const consultation = await Consultation.create({
      userId: resolvedUserId,
      guestSessionHash: resolvedGuestSessionHash,
      guestSessionExpiresAt: resolvedGuestExpiresAt,
      idempotencyKey,
      requestPayloadHash: payloadHash,
      recipientName: recipientName || 'Recipient',
      relationship,
      occasion,
      interests: interests || [],
      personality: personality || [],
      desiredEmotion,
      budget: budget || { min: 500, max: 3500, currency: 'INR' },
      productCategories: productCategories || [],
      exclusions: exclusions || [],
      notes: notes || '',
      status: status || 'completed',
    });

    res.status(201).json({
      success: true,
      message: 'Consultation profile created and persisted successfully',
      data: sanitizeConsultation(consultation),
    });
  } catch (error) {
    // Handle concurrent duplicate key race condition
    if (error.code === 11000 && idempotencyKey) {
      try {
        const ownershipQuery = resolvedUserId
          ? { userId: resolvedUserId, idempotencyKey }
          : { guestSessionHash: resolvedGuestSessionHash, idempotencyKey };

        const existing = await Consultation.findOne(ownershipQuery);
        if (existing) {
          if (existing.requestPayloadHash && existing.requestPayloadHash !== payloadHash) {
            return res.status(409).json({
              success: false,
              message: 'Idempotency conflict: A consultation already exists with this idempotency key but with different submission parameters.',
              code: 'IDEMPOTENCY_CONFLICT',
            });
          }

          return res.status(200).json({
            success: true,
            message: 'Consultation retrieved from existing idempotent submission',
            data: sanitizeConsultation(existing),
          });
        }
      } catch (findErr) {
        // Fall through to 500
      }
    }

    if (
      (error.name === 'MongooseError' && error.message.includes('buffering timed out')) ||
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('whitelist')
    ) {
      return res.status(503).json({
        success: false,
        message: 'Database service is currently unavailable. Please verify MongoDB Atlas connection and IP whitelist.',
        code: 'DATABASE_UNAVAILABLE',
        error: { code: 'DATABASE_UNAVAILABLE', details: error.message },
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create consultation profile in database',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * GET /api/v1/consultations
 * Lists consultations:
 * - If authenticated: returns consultations owned by req.user.id.
 * - If guest with valid session cookie: returns consultations owned by that guest session.
 * - Otherwise: requires authentication (401).
 */
const getConsultations = async (req, res) => {
  if (!assertDatabaseReady(res)) return;
  try {
    if (req.user) {
      const consultations = await Consultation.find({ userId: req.user.id }).sort({
        createdAt: -1,
      });
      return res.json({
        success: true,
        message: 'Consultations retrieved successfully',
        data: consultations.map(sanitizeConsultation),
      });
    }

    // Guest lookup using session cookie
    const guestToken = getGuestTokenFromRequest(req);
    if (!guestToken) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No session or access token provided.',
        code: 'AUTH_REQUIRED',
      });
    }

    const tokenHash = hashGuestToken(guestToken);
    const guestConsultations = await Consultation.find({
      userId: null,
      guestSessionHash: tokenHash,
      guestSessionExpiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Guest consultations retrieved successfully',
      data: guestConsultations.map(sanitizeConsultation),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve consultations',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * GET /api/v1/consultations/:id
 * Retrieves a single consultation:
 * - If user-owned: verified against req.user.id.
 * - If guest-owned: verified against presented guest session cookie hash.
 */
const getConsultationById = async (req, res) => {
  if (!assertDatabaseReady(res)) return;
  try {
    const { id } = req.params;
    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
        code: 'NOT_FOUND',
      });
    }

    // 1. Authenticated consultation ownership check
    if (consultation.userId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to access this consultation',
          code: 'AUTH_REQUIRED',
        });
      }

      if (
        consultation.userId.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this consultation record',
          code: 'FORBIDDEN',
        });
      }
    } else {
      // 2. Guest consultation ownership check
      const authResult = verifyGuestRecordOwnership(consultation, req);
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
      data: sanitizeConsultation(consultation),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve consultation',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * PUT /api/v1/consultations/:id
 * Updates or claims a consultation:
 * - If user-owned: only owner or admin can update.
 * - If guest-owned: requires valid guest session cookie proof.
 * - If authenticated user presents valid guest session proof, performs atomic claiming.
 */
const updateConsultation = async (req, res) => {
  if (!assertDatabaseReady(res)) return;
  try {
    const { id } = req.params;
    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
        code: 'NOT_FOUND',
      });
    }

    // Extract allowed update fields
    const updates = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    // 1. User-owned consultation update
    if (consultation.userId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to modify this consultation',
          code: 'AUTH_REQUIRED',
        });
      }

      if (
        consultation.userId.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this consultation record',
          code: 'FORBIDDEN',
        });
      }

      Object.assign(consultation, updates);
      await consultation.save();

      return res.json({
        success: true,
        message: 'Consultation updated successfully',
        data: sanitizeConsultation(consultation),
      });
    }

    // 2. Guest-owned consultation: verify session proof
    const authResult = verifyGuestRecordOwnership(consultation, req);
    if (!authResult.allowed) {
      return res.status(authResult.status).json({
        success: false,
        message: authResult.message,
        code: authResult.code,
      });
    }

    // 2A. Authenticated claiming flow: requires proof of guest session
    if (req.user) {
      const claimed = await Consultation.findOneAndUpdate(
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
          message: 'Unable to claim consultation: session mismatch or already claimed',
          code: 'CLAIM_FAILED',
        });
      }

      return res.json({
        success: true,
        message: 'Consultation claimed and linked to your account successfully',
        data: sanitizeConsultation(claimed),
      });
    }

    // 2B. Normal guest update: user remains guest, verified by session cookie
    Object.assign(consultation, updates);
    await consultation.save();

    res.json({
      success: true,
      message: 'Consultation updated successfully',
      data: sanitizeConsultation(consultation),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update consultation',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * DELETE /api/v1/consultations/:id
 * Deletes a consultation:
 * - If user-owned: only owner or admin can delete.
 * - If guest-owned: requires valid guest session cookie proof (or admin).
 */
const deleteConsultation = async (req, res) => {
  if (!assertDatabaseReady(res)) return;
  try {
    const { id } = req.params;
    const consultation = await Consultation.findById(id);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation not found',
        code: 'NOT_FOUND',
      });
    }

    // 1. User-owned deletion
    if (consultation.userId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to delete this consultation',
          code: 'AUTH_REQUIRED',
        });
      }

      if (
        consultation.userId.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this consultation record',
          code: 'FORBIDDEN',
        });
      }

      await Consultation.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: 'Consultation deleted successfully',
      });
    }

    // 2. Guest-owned deletion
    if (req.user && req.user.role === 'admin') {
      await Consultation.findByIdAndDelete(id);
      return res.json({
        success: true,
        message: 'Consultation deleted by administrator',
      });
    }

    const authResult = verifyGuestRecordOwnership(consultation, req);
    if (!authResult.allowed) {
      return res.status(authResult.status).json({
        success: false,
        message: authResult.message,
        code: authResult.code,
      });
    }

    await Consultation.findOneAndDelete({
      _id: id,
      userId: null,
      guestSessionHash: authResult.tokenHash,
    });

    res.json({
      success: true,
      message: 'Guest consultation deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete consultation',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

/**
 * POST /api/v1/consultations/generate/:consultationId?
 * Generates recommendations with ownership verification if consultationId is provided.
 */
const generateRecommendations = async (req, res) => {
  if (!assertDatabaseReady(res)) return;
  try {
    const { consultationId } = req.params;

    if (!consultationId) {
      return res.status(400).json({
        success: false,
        message: 'Consultation ID is required. Recommendations must be generated from a persisted consultation profile.',
        code: 'CONSULTATION_ID_REQUIRED',
      });
    }

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Consultation record not found',
        code: 'NOT_FOUND',
      });
    }

    // Check ownership if user-owned
    if (consultation.userId) {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to access this consultation profile',
          code: 'AUTH_REQUIRED',
        });
      }

      if (
        consultation.userId.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You do not own this consultation record',
          code: 'FORBIDDEN',
        });
      }
    } else {
      // Guest record: verify session proof
      const authResult = verifyGuestRecordOwnership(consultation, req);
      if (!authResult.allowed) {
        return res.status(authResult.status).json({
          success: false,
          message: authResult.message,
          code: authResult.code,
        });
      }
    }

    // Call dedicated recommendation service for grounded, deterministic ranking
    const { items, message } = await recommendationService.generateGroundedRecommendations(consultation);

    return res.json({
      success: true,
      message,
      data: {
        consultationId: consultation._id.toString(),
        items,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate recommendations from database',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
  generateRecommendations,
};
