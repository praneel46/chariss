const express = require('express');
const router = express.Router();
const bagAndWishlistRoutes = require('./bagAndWishlistRoutes');
const {
  getUserWishlist,
  getUserBag,
} = require('../controllers/bagAndWishlistController');
const {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
  generateRecommendations,
} = require('../controllers/consultationController');
const { auth, optionalAuth } = require('../middleware/auth');
const { validateBody, validateParams } = require('../middleware/validate');
const {
  createConsultationSchema,
  updateConsultationSchema,
} = require('../validations/consultationValidation');
const {
  objectIdParamSchema,
  consultationIdParamSchema,
} = require('../validations/commonValidation');

// Create consultation: supports authenticated user or guest, rejects client-supplied userId
router.post(
  '/',
  optionalAuth,
  validateBody(createConsultationSchema),
  createConsultation
);

// List user or guest consultations
router.get('/', optionalAuth, getConsultations);

// Explicitly reject unpersisted profile generation attempts without a consultationId
router.post('/generate', (req, res) => {
  return res.status(400).json({
    success: false,
    message: 'Consultation ID is required. Recommendations must be generated from a persisted consultation profile.',
    code: 'CONSULTATION_ID_REQUIRED',
  });
});

// Generate recommendations: requires persisted consultation ID and validates ownership
router.post(
  '/generate/:consultationId',
  optionalAuth,
  validateParams(consultationIdParamSchema),
  generateRecommendations
);

// User account-scoped Wishlist & Bag routes (must be defined before /:consultationId and /:id)
router.get('/account/wishlist', auth, getUserWishlist);
router.get('/account/bag', auth, getUserBag);

// Sub-resource routes for consultation-specific Gift Bag & Wishlist
router.use('/:consultationId', bagAndWishlistRoutes);

// Retrieve single consultation: verifies ownership for user-owned records
router.get(
  '/:id',
  optionalAuth,
  validateParams(objectIdParamSchema),
  getConsultationById
);

// Update consultation: verifies ownership
router.put(
  '/:id',
  optionalAuth,
  validateParams(objectIdParamSchema),
  validateBody(updateConsultationSchema),
  updateConsultation
);

// Delete consultation: verifies authenticated owner or guest session owner
router.delete(
  '/:id',
  optionalAuth,
  validateParams(objectIdParamSchema),
  deleteConsultation
);

module.exports = router;
