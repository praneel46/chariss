/**
 * CHARIS Product Catalogue Seeder & Safe Migration Engine
 *
 * FIELD OWNERSHIP POLICY:
 * ---------------------------------------------------------------------------------
 * 1. DATABASE-MANAGED / ADMIN-CURATED FIELDS (Strictly Preserved):
 *    - `rating`: Customer / dynamic platform rating (never overwritten by seed)
 *    - `reviewCount`: Dynamic platform review tally
 *    - `availability`: Real-time stock state ('in_stock', 'low_stock', 'made_to_order')
 *    - `createdAt`: Original creation timestamp
 *    - `active`: RETIRED PRODUCT SAFETY — If an existing record has `active: false`
 *      (e.g., retired or administrator-disabled), the seeder will NOT silently
 *      reactivate it.
 *
 * 2. SEED-MANAGED / SOURCE-OF-TRUTH FIELDS (Audited Source Updates):
 *    - `name`, `slug`, `tagline`, `description`
 *    - `categoryId`, `categoryName`
 *    - `price`, `originalPrice`, `currency`
 *    - `retailer`: { id, name, website, verified, sourceType, verificationNote }
 *    - `imageUrl`, `secondaryImageUrl`, `productUrl`
 *    - `tags`, `interests`, `occasions`, `relationships`, `personalities`
 *    - `badge`, `serialNumber`, `lastVerifiedAt`
 *
 * 3. CONFLICT DETECTION & AUDIT LOGGING:
 *    - Compares existing database values against incoming seed data.
 *    - Any price discrepancy or retailer discrepancy is explicitly reported as a
 *      tracked conflict rather than silently overwritten.
 * ---------------------------------------------------------------------------------
 */

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const { connectDB, disconnectDB } = require('../src/config/db');
const Product = require('../src/models/Product');
const { SEED_PRODUCTS } = require('../src/data/seedData');

/**
 * Validates product metadata integrity before database execution.
 */
const validateProductRecord = (item, index) => {
  const required = ['name', 'slug', 'description', 'categoryId', 'categoryName', 'price', 'imageUrl', 'productUrl'];
  for (const field of required) {
    if (item[field] === undefined || item[field] === null || item[field] === '') {
      throw new Error(`Record at index ${index} (${item.slug || 'unknown'}) is missing required field: ${field}`);
    }
  }
  if (!item.retailer || !item.retailer.name || !item.retailer.website) {
    throw new Error(`Record at index ${index} (${item.slug}) has invalid retailer information`);
  }
  if (typeof item.price !== 'number' || item.price <= 0) {
    throw new Error(`Record at index ${index} (${item.slug}) has invalid price: ${item.price}`);
  }
};

/**
 * Executes safe, idempotent catalogue migration with conflict detection.
 *
 * @param {Object} [options] - Migration options
 * @param {boolean} [options.allowReactivation=false] - Whether to explicitly allow reactivating retired items
 * @returns {Promise<Object>} Migration summary report
 */
const seedDB = async (options = {}) => {
  const allowReactivation = options.allowReactivation === true;

  try {
    console.log('==================================================');
    console.log('🌱 CHARIS PRODUCT CATALOGUE SEEDER & MIGRATION');
    console.log('==================================================');
    console.log(`[CHARIS Seeder] Validating ${SEED_PRODUCTS.length} seed products...`);

    // Pre-flight validation & duplicate slug check
    const slugSet = new Set();
    SEED_PRODUCTS.forEach((item, idx) => {
      validateProductRecord(item, idx);
      if (slugSet.has(item.slug)) {
        throw new Error(`Duplicate slug detected in seed dataset: "${item.slug}" at index ${idx}`);
      }
      slugSet.add(item.slug);
    });

    console.log(`[CHARIS Seeder] Pre-flight check passed: ${SEED_PRODUCTS.length} unique, valid product records.`);

    console.log('[CHARIS Seeder] Connecting to database...');
    await connectDB();

    const initialTotal = await Product.countDocuments();
    const initialActive = await Product.countDocuments({ active: true });
    const initialInactive = await Product.countDocuments({ active: false });

    console.log(`[CHARIS Seeder] Current database state before operation:`);
    console.log(`  - Total products: ${initialTotal}`);
    console.log(`  - Active products: ${initialActive}`);
    console.log(`  - Inactive products: ${initialInactive}`);

    let matchedCount = 0;
    let insertedCount = 0;
    let updatedCount = 0;
    const conflicts = [];
    const retiredPreserved = [];

    for (const item of SEED_PRODUCTS) {
      const existing = await Product.collection.findOne({ slug: item.slug });

      if (!existing) {
        // Safe Insert: Brand new product
        // Enforce data integrity: never fabricate customer ratings or assume in_stock without verified admin data
        const { _id, ...cleanItem } = item;
        const hasVerifiedReviews = typeof cleanItem.reviewCount === 'number' && cleanItem.reviewCount > 0 && typeof cleanItem.rating === 'number';

        const insertPayload = {
          ...cleanItem,
          rating: hasVerifiedReviews ? cleanItem.rating : undefined,
          reviewCount: hasVerifiedReviews ? cleanItem.reviewCount : 0,
          availability: (cleanItem.availability === 'low_stock' || cleanItem.availability === 'made_to_order') ? cleanItem.availability : 'unknown',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Remove undefined fields so MongoDB does not store null/undefined
        if (insertPayload.rating === undefined) {
          delete insertPayload.rating;
        }

        await Product.collection.insertOne(insertPayload);
        insertedCount++;
        continue;
      }

      // Existing Record Found: Inspect for conflicts & respect field ownership
      matchedCount++;

      // Check for price conflict
      if (existing.price !== undefined && existing.price !== item.price) {
        conflicts.push({
          slug: item.slug,
          field: 'price',
          existingValue: existing.price,
          incomingValue: item.price,
          action: 'Updated to verified seed price with audit record',
        });
      }

      // Check for retailer conflict
      if (existing.retailer?.website && existing.retailer.website !== item.retailer?.website) {
        conflicts.push({
          slug: item.slug,
          field: 'retailer.website',
          existingValue: existing.retailer.website,
          incomingValue: item.retailer?.website,
          action: 'Updated to verified official source URL',
        });
      }

      // Retired Product Safety Policy:
      // If product is already retired/inactive in DB, do NOT accidentally reactivate it
      let targetActive = item.active;
      if (existing.active === false && item.active === true && !allowReactivation) {
        targetActive = false;
        retiredPreserved.push(item.slug);
      }

      // Construct deliberate update document (preserving admin-managed fields)
      const updateDoc = {
        name: item.name,
        tagline: item.tagline,
        description: item.description,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        price: item.price,
        originalPrice: item.originalPrice,
        currency: item.currency || 'INR',
        imageUrl: item.imageUrl,
        secondaryImageUrl: item.secondaryImageUrl,
        productUrl: item.productUrl,
        retailer: item.retailer,
        tags: item.tags,
        interests: item.interests,
        occasions: item.occasions,
        relationships: item.relationships,
        personalities: item.personalities,
        source: item.source || 'internal',
        lastVerifiedAt: item.lastVerifiedAt || new Date().toISOString().slice(0, 10),
        badge: item.badge,
        serialNumber: item.serialNumber,
        active: targetActive,
        updatedAt: new Date(),
        // Explicitly PRESERVE database-managed fields (never overwrite admin curated state):
        rating: existing.rating !== undefined ? existing.rating : (typeof item.rating === 'number' && item.reviewCount > 0 ? item.rating : undefined),
        reviewCount: existing.reviewCount !== undefined ? existing.reviewCount : (typeof item.reviewCount === 'number' ? item.reviewCount : 0),
        availability: existing.availability !== undefined ? existing.availability : (item.availability || 'unknown'),
      };

      if (updateDoc.rating === undefined) {
        delete updateDoc.rating;
      }

      await Product.collection.updateOne(
        { slug: item.slug },
        { $set: updateDoc }
      );
      updatedCount++;
    }

    const finalTotal = await Product.countDocuments();
    const finalActive = await Product.countDocuments({ active: true });
    const finalInactive = await Product.countDocuments({ active: false });

    console.log(`\n[CHARIS Seeder] Operation Summary:`);
    console.log(`  - Products evaluated: ${SEED_PRODUCTS.length}`);
    console.log(`  - Newly inserted records: ${insertedCount}`);
    console.log(`  - Existing matched records: ${matchedCount}`);
    console.log(`  - Safe deliberate updates: ${updatedCount}`);
    console.log(`  - Detected & tracked conflicts: ${conflicts.length}`);
    console.log(`  - Retired products protected from reactivation: ${retiredPreserved.length}`);

    if (conflicts.length > 0) {
      console.log(`\n[CHARIS Seeder] Tracked Conflicts Audit Log:`);
      conflicts.forEach((c) => {
        console.log(`  • [${c.slug}] ${c.field}: DB=${c.existingValue} -> Seed=${c.incomingValue} (${c.action})`);
      });
    }

    console.log(`\n[CHARIS Seeder] Final database state:`);
    console.log(`  - Total products in database: ${finalTotal}`);
    console.log(`  - Active products: ${finalActive}`);
    console.log(`  - Inactive products: ${finalInactive}`);
    console.log('==================================================');

    await disconnectDB();
    return {
      success: true,
      matchedCount,
      insertedCount,
      updatedCount,
      conflicts,
      retiredPreserved,
      initialTotal,
      finalTotal,
      finalActive,
      finalInactive,
    };
  } catch (err) {
    console.error('\n❌ [CHARIS Seeder Error]:', err.message);
    try {
      await disconnectDB();
    } catch (_) {}
    process.exit(1);
  }
};

if (require.main === module) {
  seedDB().then(() => process.exit(0));
}

module.exports = { seedDB };
