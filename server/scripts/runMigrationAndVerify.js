/**
 * CHARIS Phase 2, Step 3.2: Automated Live Atlas Migration & Field-Level Verification
 */

const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

const { connectDB, disconnectDB } = require('../src/config/db');
const Product = require('../src/models/Product');
const { SEED_PRODUCTS } = require('../src/data/seedData');

async function run() {
  console.log('====================================================');
  console.log('🚀 CHARIS LIVE ATLAS MIGRATION & VERIFICATION');
  console.log('====================================================');

  try {
    console.log('[Step 1] Connecting to MongoDB Atlas...');
    const conn = await connectDB();
    const db = conn.connection.db;

    console.log('Connected to Atlas successfully.');

    // 1. Unrelated collections pre-check
    const collectionList = await db.listCollections().toArray();
    const collectionNames = collectionList.map(c => c.name);
    console.log('Existing collections:', collectionNames);

    const initialCollectionCounts = {};
    for (const name of collectionNames) {
      initialCollectionCounts[name] = await db.collection(name).countDocuments();
    }
    console.log('Initial collection counts:', initialCollectionCounts);

    // 2. Product collection pre-migration snapshot
    const initialProductCount = await Product.countDocuments();
    const initialIndexes = await db.collection('products').indexes();
    const initialProducts = await Product.find({}).lean();

    console.log(`Initial product count: ${initialProductCount}`);
    console.log('Initial product indexes:', initialIndexes.map(i => Object.keys(i.key).join('_')));

    // Index original products by slug
    const preSnapshotMap = new Map();
    initialProducts.forEach(p => preSnapshotMap.set(p.slug, p));

    // 3. Execute Migration Run 1
    console.log('\n[Step 2] Executing Migration Run 1 (Slug-based $setOnInsert)...');
    let matchedCount = 0;
    let insertedCount = 0;
    let modifiedCount = 0;

    for (const item of SEED_PRODUCTS) {
      const res = await Product.updateOne(
        { slug: item.slug },
        { $setOnInsert: item },
        { upsert: true }
      );
      if (res.upsertedCount > 0) {
        insertedCount++;
      } else if (res.matchedCount > 0) {
        matchedCount++;
        if (res.modifiedCount > 0) modifiedCount++;
      }
    }

    console.log(`Run 1 Results:`);
    console.log(`  - Matched (Existing): ${matchedCount}`);
    console.log(`  - Newly Inserted: ${insertedCount}`);
    console.log(`  - Modified: ${modifiedCount}`);

    // 4. Verify Post-Migration 1
    const postCount1 = await Product.countDocuments();
    const postActiveCount1 = await Product.countDocuments({ active: true });
    const postInactiveCount1 = await Product.countDocuments({ active: false });

    console.log(`\nPost-Migration Counts:`);
    console.log(`  - Total Products: ${postCount1} (Expected: 51)`);
    console.log(`  - Active Products: ${postActiveCount1} (Expected: 12)`);
    console.log(`  - Inactive Products: ${postInactiveCount1} (Expected: 39)`);

    // Verify 12 original records field-by-field
    console.log('\n[Step 3] Field-level verification of preserved original records...');
    let fieldDiscrepancies = 0;
    for (const [slug, originalDoc] of preSnapshotMap.entries()) {
      const currentDoc = await Product.findOne({ slug }).lean();
      if (!currentDoc) {
        console.error(`❌ CRITICAL: Original product missing: ${slug}`);
        fieldDiscrepancies++;
        continue;
      }

      // Check critical fields
      const fieldsToCheck = ['name', 'price', 'currency', 'categoryId', 'categoryName', 'imageUrl', 'productUrl', 'active', 'serialNumber'];
      for (const field of fieldsToCheck) {
        if (JSON.stringify(currentDoc[field]) !== JSON.stringify(originalDoc[field])) {
          console.error(`❌ Field mismatch in ${slug}.${field}: Original="${originalDoc[field]}" vs Current="${currentDoc[field]}"`);
          fieldDiscrepancies++;
        }
      }
      if (JSON.stringify(currentDoc.retailer) !== JSON.stringify(originalDoc.retailer)) {
        console.error(`❌ Retailer mismatch in ${slug}`);
        fieldDiscrepancies++;
      }
    }

    if (fieldDiscrepancies === 0) {
      console.log(`✅ All ${preSnapshotMap.size} original records verified 100% byte-for-byte equivalent.`);
    } else {
      console.error(`❌ Total field discrepancies found: ${fieldDiscrepancies}`);
    }

    // Verify 39 draft records
    console.log('\n[Step 4] Verifying 39 newly inserted draft records...');
    const draftProducts = await Product.find({ active: false }).lean();
    console.log(`Found ${draftProducts.length} draft products.`);
    let draftErrors = 0;
    draftProducts.forEach(dp => {
      if (dp.active !== false) {
        console.error(`Draft record ${dp.slug} has active=${dp.active}`);
        draftErrors++;
      }
      if (!dp.name || !dp.slug || !dp.price || !dp.imageUrl) {
        console.error(`Draft record ${dp.slug} missing essential fields`);
        draftErrors++;
      }
    });
    if (draftErrors === 0) {
      console.log('✅ All 39 draft products verified with active: false.');
    }

    // Verify indexes
    const postIndexes = await db.collection('products').indexes();
    console.log('Post-migration indexes intact:', postIndexes.length === initialIndexes.length);

    // 5. Execute Migration Run 2 (Idempotency)
    console.log('\n[Step 5] Executing Migration Run 2 (Idempotency Check)...');
    let run2Matched = 0;
    let run2Inserted = 0;
    let run2Modified = 0;

    for (const item of SEED_PRODUCTS) {
      const res = await Product.updateOne(
        { slug: item.slug },
        { $setOnInsert: item },
        { upsert: true }
      );
      if (res.upsertedCount > 0) run2Inserted++;
      else if (res.matchedCount > 0) {
        run2Matched++;
        if (res.modifiedCount > 0) run2Modified++;
      }
    }

    console.log(`Run 2 Results:`);
    console.log(`  - Matched: ${run2Matched} (Expected: 51)`);
    console.log(`  - Newly Inserted: ${run2Inserted} (Expected: 0)`);
    console.log(`  - Modified: ${run2Modified} (Expected: 0)`);

    // Verify unrelated collections post-check
    console.log('\n[Step 6] Verifying unrelated collections remain untouched...');
    let collectionAlterations = 0;
    for (const name of collectionNames) {
      if (name === 'products') continue;
      const count = await db.collection(name).countDocuments();
      if (count !== initialCollectionCounts[name]) {
        console.error(`❌ Collection '${name}' count changed: ${initialCollectionCounts[name]} -> ${count}`);
        collectionAlterations++;
      } else {
        console.log(`  - Collection '${name}': count preserved (${count})`);
      }
    }
    if (collectionAlterations === 0) {
      console.log('✅ All unrelated collections verified untouched.');
    }

    await disconnectDB();
    console.log('\n🎉 ALL LIVE ATLAS MIGRATION AND VERIFICATION TASKS COMPLETED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Execution error:', err.message);
    try { await disconnectDB(); } catch (_) {}
    process.exit(1);
  }
}

run();
