const express = require('express');
const router = express.Router();
const {
  getTemplates,
  createGiftCard,
  getGiftCards,
  getGiftCardById,
  updateGiftCard,
  deleteGiftCard,
} = require('../controllers/giftCardController');
const { auth, optionalAuth } = require('../middleware/auth');
const { validateBody, validateParams } = require('../middleware/validate');
const {
  createGiftCardSchema,
  updateGiftCardSchema,
} = require('../validations/giftCardValidation');
const { objectIdParamSchema } = require('../validations/commonValidation');

// Retrieve available gift card templates (public)
router.get('/templates', getTemplates);

// Create gift card: supports authenticated user or guest, rejects client-supplied userId
router.post(
  '/',
  optionalAuth,
  validateBody(createGiftCardSchema),
  createGiftCard
);

// List user or guest gift cards
router.get('/', optionalAuth, getGiftCards);

// Retrieve single gift card: verifies ownership for user-owned cards
router.get(
  '/:id',
  optionalAuth,
  validateParams(objectIdParamSchema),
  getGiftCardById
);

// Update gift card: verifies ownership
router.put(
  '/:id',
  optionalAuth,
  validateParams(objectIdParamSchema),
  validateBody(updateGiftCardSchema),
  updateGiftCard
);

// Delete gift card: verifies authenticated owner or guest session owner
router.delete(
  '/:id',
  optionalAuth,
  validateParams(objectIdParamSchema),
  deleteGiftCard
);

module.exports = router;
