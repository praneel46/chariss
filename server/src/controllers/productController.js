const mongoose = require('mongoose');
const Product = require('../models/Product');

// GET /api/v1/products
const getProducts = async (req, res) => {
  try {
    const { category, search, occasion } = req.query;
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

    const products = await Product.find(query).sort({ serialNumber: 1 });

    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products,
      meta: { total: products.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products from database',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

// GET /api/v1/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ active: true }).limit(6).sort({ serialNumber: 1 });

    res.json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: products,
      meta: { total: products.length },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured products from database',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

// GET /api/v1/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const queryConditions = [{ slug: id }, { serialNumber: id }];
    if (mongoose.Types.ObjectId.isValid(id)) {
      queryConditions.unshift({ _id: id });
    }

    const product = await Product.findOne({
      $or: queryConditions,
      active: true,
    });

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
      message: 'Failed to retrieve product from database',
      error: { code: 'SERVER_ERROR', details: error.message },
    });
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
};
