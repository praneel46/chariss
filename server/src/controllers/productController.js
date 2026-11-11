const Product = require('../models/Product');
const { SEED_PRODUCTS } = require('../data/seedData');

// GET /api/v1/products
const getProducts = async (req, res) => {
  try {
    const { category, search, occasion } = req.query;
    let products = [];

    // Try MongoDB first if connected
    if (Product.db && Product.db.readyState === 1) {
      const query = { active: true };
      if (category && category !== 'all') query.categoryId = category;
      if (occasion) query.occasions = occasion;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }
      products = await Product.find(query).sort({ serialNumber: 1 });
    }

    // Fallback to in-memory curated catalogue
    if (!products || products.length === 0) {
      products = SEED_PRODUCTS.filter((p) => {
        const matchesCategory = !category || category === 'all' || p.categoryId === category;
        const matchesOccasion = !occasion || p.occasions.includes(occasion);
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        return matchesCategory && matchesOccasion && matchesSearch;
      });
    }

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      meta: { total: products.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

// GET /api/v1/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    let products = [];
    if (Product.db && Product.db.readyState === 1) {
      products = await Product.find({ active: true }).limit(6).sort({ serialNumber: 1 });
    }
    if (!products || products.length === 0) {
      products = SEED_PRODUCTS.slice(0, 6);
    }
    res.json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: products,
      meta: { total: products.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured products',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

// GET /api/v1/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (Product.db && Product.db.readyState === 1) {
      product = await Product.findById(id).catch(() => null);
    }

    if (!product) {
      product = SEED_PRODUCTS.find((p) => p.slug === id || p.serialNumber === id);
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      message: 'Product found',
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve product',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
};
