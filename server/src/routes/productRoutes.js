const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getProductById,
} = require('../controllers/productController');

// Static routes declared first per Section 7 Blueprint
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
