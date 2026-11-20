const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getBag,
  addToBag,
  updateBagItem,
  removeFromBag,
  clearBag,
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  validateAndProcessCheckout,
} = require('../controllers/bagAndWishlistController');
const { optionalAuth } = require('../middleware/auth');

// Apply optionalAuth to all routes so req.user is set when authenticated
router.use(optionalAuth);

// --- Bag Routes (/api/v1/consultations/:consultationId/bag) ---
router.get('/bag', getBag);
router.post('/bag', addToBag);
router.post('/bag/checkout', validateAndProcessCheckout);
router.post('/checkout', validateAndProcessCheckout);
router.patch('/bag/:productId', updateBagItem);
router.delete('/bag/:productId', removeFromBag);
router.delete('/bag', clearBag);

// --- Wishlist Routes (/api/v1/consultations/:consultationId/wishlist) ---
router.get('/wishlist', getWishlist);
router.post('/wishlist', toggleWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

module.exports = router;
