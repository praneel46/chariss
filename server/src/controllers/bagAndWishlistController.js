const mongoose = require('mongoose');
const Consultation = require('../models/Consultation');
const GiftBag = require('../models/GiftBag');
const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const {
  getGuestTokenFromRequest,
  hashGuestToken,
  verifyGuestRecordOwnership,
} = require('../utils/guestSessionUtils');

/**
 * Strict server-side validation for artisan destination URLs.
 * Requires https: protocol, valid domain structure, and rejects placeholders/local/test domains.
 */
function isServerValidVerifiedHttpsUrl(url) {
  if (!url || typeof url !== 'string' || url === '#' || url.trim() === '') return false;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return false;

    const hostname = parsed.hostname.toLowerCase();
    const disallowed = [
      'example.com',
      'placeholder',
      'test.com',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      'undefined',
      'null',
    ];
    if (disallowed.some((d) => hostname.includes(d))) return false;

    // Disallow javascript:, data:, or mailto: embedded in path/query
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:')) {
      return false;
    }

    const parts = hostname.split('.');
    if (parts.length < 2 || parts[parts.length - 1].length < 2) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates consultation existence and enforces cross-consultation ownership security.
 */
async function getAndAuthorizeConsultation(req, res, consultationId) {
  if (!consultationId || !mongoose.Types.ObjectId.isValid(consultationId)) {
    res.status(400).json({
      success: false,
      message: 'Invalid consultation ID format.',
      code: 'INVALID_CONSULTATION_ID',
    });
    return null;
  }

  const consultation = await Consultation.findById(consultationId);
  if (!consultation) {
    res.status(404).json({
      success: false,
      message: 'Consultation profile not found.',
      code: 'CONSULTATION_NOT_FOUND',
    });
    return null;
  }

  // Authenticated user ownership check
  if (consultation.userId) {
    if (!req.user || req.user.id !== consultation.userId.toString()) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to access this consultation.',
        code: 'FORBIDDEN',
      });
      return null;
    }
    return consultation;
  }

  // Guest consultation ownership check
  if (consultation.guestSessionHash) {
    const authResult = verifyGuestRecordOwnership(consultation, req);
    if (!authResult.allowed) {
      // Check if user is authenticated and claiming the guest session
      if (req.user) {
        const rawToken = getGuestTokenFromRequest(req);
        if (rawToken && hashGuestToken(rawToken) === consultation.guestSessionHash) {
          consultation.userId = req.user.id;
          await consultation.save();
          return consultation;
        }
      }

      res.status(authResult.status || 403).json({
        success: false,
        message: authResult.message || 'Access denied: Invalid guest session for this consultation.',
        code: authResult.code || 'FORBIDDEN',
      });
      return null;
    }

    // If authenticated user matches guest cookie, auto-link consultation
    if (req.user) {
      consultation.userId = req.user.id;
      await consultation.save();
    }
    return consultation;
  }

  return consultation;
}

// ==================== GIFT BAG CONTROLLERS ====================

/**
 * GET /api/v1/consultations/account/bag
 * Returns all bag items belonging exclusively to the authenticated user.
 */
async function getUserBag(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for account gift bag.',
        code: 'AUTH_REQUIRED',
      });
    }

    const items = await GiftBag.find({ userId: req.user.id }).sort({ addedAt: -1 });
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    return res.status(200).json({
      success: true,
      userId: req.user.id,
      items,
      totalCount,
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/consultations/:consultationId/bag
 */
async function getBag(req, res, next) {
  try {
    const { consultationId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return;

    // Strict ownership filter: authenticated user queries must match req.user.id; guest queries match guestSessionHash
    const query = { consultationId };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.guestSessionHash = consultation.guestSessionHash;
      query.userId = null;
    }

    const items = await GiftBag.find(query).sort({ addedAt: -1 });

    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    return res.status(200).json({
      success: true,
      consultationId,
      items,
      totalCount,
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/consultations/:consultationId/bag
 */
async function addToBag(req, res, next) {
  try {
    const { consultationId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return;

    const { productId, product, quantity = 1, selected = true } = req.body;
    if (!productId || !product) {
      return res.status(400).json({
        success: false,
        message: 'productId and product details are required.',
        code: 'MISSING_REQUIRED_FIELDS',
      });
    }

    const itemQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    const rawGuestToken = getGuestTokenFromRequest(req);
    const guestSessionHash = rawGuestToken ? hashGuestToken(rawGuestToken) : consultation.guestSessionHash || null;
    const userId = req.user ? req.user.id : null;

    // Authoritative product validation: Never trust client-supplied price, URL, or verified flags
    let sanitizedProduct = product ? { ...product } : {};
    let dbProduct = null;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      dbProduct = await Product.findById(productId);
    }
    if (!dbProduct && product?.id && mongoose.Types.ObjectId.isValid(product.id)) {
      dbProduct = await Product.findById(product.id);
    }
    if (!dbProduct) {
      dbProduct = await Product.findOne({
        $or: [{ slug: productId }, { name: product?.name }],
      });
    }

    if (dbProduct) {
      sanitizedProduct = {
        id: dbProduct._id.toString(),
        name: dbProduct.name,
        price: dbProduct.price,
        imageUrl: dbProduct.imageUrl,
        productUrl: dbProduct.productUrl,
        categoryName: dbProduct.categoryName,
        retailer: {
          id: dbProduct.retailer?.id || 'ret-01',
          name: dbProduct.retailer?.name || 'Artisan Workshop',
          website: dbProduct.retailer?.website || '',
          verified: Boolean(dbProduct.retailer?.verified),
        },
      };
    } else {
      // For uncatalogued items, strictly prevent client from setting retailer.verified = true
      sanitizedProduct.retailer = {
        ...sanitizedProduct.retailer,
        verified: false,
      };
    }

    const query = { consultationId, productId };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.guestSessionHash = consultation.guestSessionHash;
      query.userId = null;
    }

    const existing = await GiftBag.findOne(query);
    let item;

    if (existing) {
      existing.quantity += itemQuantity;
      existing.selected = selected !== undefined ? Boolean(selected) : existing.selected;
      existing.product = sanitizedProduct;
      if (userId) existing.userId = userId;
      item = await existing.save();
    } else {
      item = await GiftBag.create({
        consultationId,
        userId,
        guestSessionHash: userId ? null : guestSessionHash,
        productId,
        product: sanitizedProduct,
        quantity: itemQuantity,
        selected: Boolean(selected),
      });
    }

    const allItems = await GiftBag.find(
      req.user
        ? { consultationId, userId: req.user.id }
        : { consultationId, guestSessionHash: consultation.guestSessionHash, userId: null }
    );
    const totalCount = allItems.reduce((sum, it) => sum + it.quantity, 0);
    const totalAmount = allItems.reduce((sum, it) => sum + (it.product?.price || 0) * it.quantity, 0);

    return res.status(200).json({
      success: true,
      message: 'Item added to consultation bag successfully.',
      item,
      totalCount,
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/consultations/:consultationId/bag/:productId
 */
async function updateBagItem(req, res, next) {
  try {
    const { consultationId, productId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return;

    const { quantity, selected } = req.body;
    const query = { consultationId, productId };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.guestSessionHash = consultation.guestSessionHash;
      query.userId = null;
    }

    if (quantity !== undefined && parseInt(quantity, 10) <= 0) {
      await GiftBag.findOneAndDelete(query);
    } else {
      const updateData = {};
      if (quantity !== undefined) updateData.quantity = Math.max(1, parseInt(quantity, 10));
      if (selected !== undefined) updateData.selected = Boolean(selected);

      await GiftBag.findOneAndUpdate(
        query,
        { $set: updateData },
        { new: true }
      );
    }

    const items = await GiftBag.find(
      req.user
        ? { consultationId, userId: req.user.id }
        : { consultationId, guestSessionHash: consultation.guestSessionHash, userId: null }
    ).sort({ addedAt: -1 });
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    return res.status(200).json({
      success: true,
      items,
      totalCount,
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/consultations/:consultationId/bag/:productId
 */
async function removeFromBag(req, res, next) {
  try {
    const { consultationId, productId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return;

    const query = { consultationId, productId };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.guestSessionHash = consultation.guestSessionHash;
      query.userId = null;
    }

    await GiftBag.findOneAndDelete(query);

    const items = await GiftBag.find(
      req.user
        ? { consultationId, userId: req.user.id }
        : { consultationId, guestSessionHash: consultation.guestSessionHash, userId: null }
    ).sort({ addedAt: -1 });
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

    return res.status(200).json({
      success: true,
      message: 'Item removed from bag.',
      items,
      totalCount,
      totalAmount,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/consultations/:consultationId/bag
 */
async function clearBag(req, res, next) {
  try {
    const { consultationId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return;

    const query = { consultationId };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.guestSessionHash = consultation.guestSessionHash;
      query.userId = null;
    }

    await GiftBag.deleteMany(query);

    return res.status(200).json({
      success: true,
      message: 'Consultation bag cleared.',
      items: [],
      totalCount: 0,
      totalAmount: 0,
    });
  } catch (error) {
    next(error);
  }
}

// ==================== WISHLIST CONTROLLERS ====================

/**
 * GET /api/v1/consultations/account/wishlist
 * Returns all wishlist items belonging exclusively to the authenticated user.
 */
async function getUserWishlist(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for account wishlist.',
        code: 'AUTH_REQUIRED',
      });
    }

    const items = await Wishlist.find({ userId: req.user.id }).sort({ addedAt: -1 });
    const wishlist = items.map((w) => w.productId);

    return res.status(200).json({
      success: true,
      userId: req.user.id,
      wishlist,
      items,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/consultations/:consultationId/wishlist
 */
async function getWishlist(req, res, next) {
  try {
    const { consultationId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return;

    const query = { consultationId };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.guestSessionHash = consultation.guestSessionHash;
      query.userId = null;
    }

    const items = await Wishlist.find(query).sort({ addedAt: -1 });
    const wishlist = items.map((w) => w.productId);

    return res.status(200).json({
      success: true,
      consultationId,
      wishlist,
      items,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/consultations/:consultationId/wishlist
 * Toggles product in/out of the consultation's wishlist.
 */
async function toggleWishlist(req, res, next) {
  try {
    const { consultationId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return;

    const { productId, product } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'productId is required.',
        code: 'MISSING_PRODUCT_ID',
      });
    }

    const query = { consultationId, productId };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.guestSessionHash = consultation.guestSessionHash;
      query.userId = null;
    }

    const existing = await Wishlist.findOne(query);
    let wishlisted = false;

    if (existing) {
      await Wishlist.deleteOne({ _id: existing._id });
      wishlisted = false;
    } else {
      const rawGuestToken = getGuestTokenFromRequest(req);
      const guestSessionHash = rawGuestToken ? hashGuestToken(rawGuestToken) : consultation.guestSessionHash || null;
      const userId = req.user ? req.user.id : null;

      await Wishlist.create({
        consultationId,
        userId,
        guestSessionHash: userId ? null : guestSessionHash,
        productId,
        product: product || {},
      });
      wishlisted = true;
    }

    const allWishlist = await Wishlist.find(
      req.user
        ? { consultationId, userId: req.user.id }
        : { consultationId, guestSessionHash: consultation.guestSessionHash, userId: null }
    );
    const wishlist = allWishlist.map((w) => w.productId);

    return res.status(200).json({
      success: true,
      wishlisted,
      productId,
      wishlist,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/consultations/:consultationId/wishlist/:productId
 */
async function removeFromWishlist(req, res, next) {
  try {
    const { consultationId, productId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return;

    const query = { consultationId, productId };
    if (req.user) {
      query.userId = req.user.id;
    } else {
      query.guestSessionHash = consultation.guestSessionHash;
      query.userId = null;
    }

    await Wishlist.findOneAndDelete(query);
    const allWishlist = await Wishlist.find(
      req.user
        ? { consultationId, userId: req.user.id }
        : { consultationId, guestSessionHash: consultation.guestSessionHash, userId: null }
    );
    const wishlist = allWishlist.map((w) => w.productId);

    return res.status(200).json({
      success: true,
      message: 'Item removed from wishlist.',
      wishlist,
    });
  } catch (error) {
    next(error);
  }
}

// ==================== CHECKOUT CONTROLLER ====================

/**
 * POST /api/v1/consultations/:consultationId/bag/checkout
 * Validates selected products against the authorized consultation bag,
 * performs server-side retailer verification against the official Product catalog,
 * validates destination URLs (rejecting unverified, placeholder, and non-HTTPS links),
 * and generates authoritative checkout destinations without trusting client-supplied URLs.
 */
async function validateAndProcessCheckout(req, res, next) {
  try {
    const { consultationId } = req.params;
    const consultation = await getAndAuthorizeConsultation(req, res, consultationId);
    if (!consultation) return; // 400, 403, or 404 response already dispatched

    // Fetch the consultation's authorized bag items
    const bagQuery = { consultationId };
    if (req.user) {
      bagQuery.userId = req.user.id;
    } else {
      bagQuery.guestSessionHash = consultation.guestSessionHash;
      bagQuery.userId = null;
    }
    const bagItems = await GiftBag.find(bagQuery);
    if (!bagItems || bagItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your gift bag is empty. Please add items to your consultation bag before checkout.',
        code: 'BAG_EMPTY',
      });
    }

    // Determine requested product IDs
    let requestedProductIds = req.body?.productIds;
    if (!requestedProductIds || !Array.isArray(requestedProductIds) || requestedProductIds.length === 0) {
      const selectedBagItems = bagItems.filter((it) => it.selected);
      if (selectedBagItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No items selected for checkout.',
          code: 'NO_ITEMS_SELECTED',
        });
      }
      requestedProductIds = selectedBagItems.map((it) => it.productId);
    }

    // Security Check: Verify all requested products belong to THIS consultation's authorized bag
    const bagMap = new Map();
    for (const item of bagItems) {
      bagMap.set(String(item.productId), item);
      if (item.product?.id) {
        bagMap.set(String(item.product.id), item);
      }
    }

    const itemsToCheckout = [];
    for (const pid of requestedProductIds) {
      const pidStr = String(pid);
      const bagItem = bagMap.get(pidStr);
      if (!bagItem) {
        return res.status(400).json({
          success: false,
          message: `Cross-consultation violation: Product "${pid}" does not belong to this consultation's authorized bag.`,
          code: 'CROSS_CONSULTATION_PRODUCT_SELECTION',
          productId: pid,
        });
      }
      itemsToCheckout.push(bagItem);
    }

    // Server-side validation of each item against official Product catalog
    const verifiedCheckoutItems = [];

    for (const item of itemsToCheckout) {
      let dbProduct = null;
      if (mongoose.Types.ObjectId.isValid(item.productId)) {
        dbProduct = await Product.findById(item.productId);
      }
      if (!dbProduct && item.product?.id && mongoose.Types.ObjectId.isValid(item.product.id)) {
        dbProduct = await Product.findById(item.product.id);
      }
      if (!dbProduct) {
        dbProduct = await Product.findOne({
          $or: [{ slug: item.productId }, { name: item.product?.name }],
        });
      }

      // Check retailer verification on server (NEVER trust client-supplied verified flag)
      const isVerified = dbProduct ? Boolean(dbProduct.retailer?.verified) : false;
      if (!isVerified) {
        return res.status(422).json({
          success: false,
          message: `Direct checkout is restricted: Retailer for "${dbProduct?.name || item.product?.name || item.productId}" is not a verified partner atelier.`,
          code: 'UNVERIFIED_RETAILER',
          productId: item.productId,
          productName: dbProduct?.name || item.product?.name,
          retailerName: dbProduct?.retailer?.name || item.product?.retailer?.name || 'Unknown',
        });
      }

      // Check authoritative destination URL (NEVER trust client-supplied URL)
      const destinationUrl = dbProduct.productUrl || dbProduct.retailer?.website;
      if (!isServerValidVerifiedHttpsUrl(destinationUrl)) {
        return res.status(422).json({
          success: false,
          message: `Direct checkout is restricted: Invalid, insecure, or placeholder checkout URL for "${dbProduct.name}".`,
          code: 'INVALID_DESTINATION_URL',
          productId: item.productId,
          productName: dbProduct.name,
        });
      }

      verifiedCheckoutItems.push({
        productId: item.productId,
        name: dbProduct.name,
        retailerName: dbProduct.retailer?.name || 'Artisan Workshop',
        retailerWebsite: dbProduct.retailer?.website || '',
        verified: true,
        checkoutUrl: destinationUrl,
        quantity: item.quantity,
        price: dbProduct.price,
        total: dbProduct.price * item.quantity,
      });
    }

    const totalCheckoutAmount = verifiedCheckoutItems.reduce((acc, it) => acc + it.total, 0);

    return res.status(200).json({
      success: true,
      message: 'Checkout validation passed. Authoritative atelier destinations generated.',
      consultationId,
      checkoutItems: verifiedCheckoutItems,
      totalAmount: totalCheckoutAmount,
      itemCount: verifiedCheckoutItems.length,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserBag,
  getBag,
  addToBag,
  updateBagItem,
  removeFromBag,
  clearBag,
  getUserWishlist,
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  validateAndProcessCheckout,
};
