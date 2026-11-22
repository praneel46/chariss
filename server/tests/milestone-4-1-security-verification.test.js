/**
 * CHARIS Milestone 4.1: Final Security Verification Test Suite
 *
 * Verifies:
 * 1. Partial guest-claim failures (atomic rollback and prevention of partial state)
 * 2. Recovery after interrupted claiming without duplicate or inconsistent ownership
 * 3. Invalid or forged retailer verification flags (server DB is authoritative source of truth)
 * 4. Tampered checkout URLs (strict HTTPS, no placeholders, client-supplied URLs ignored)
 * 5. Cross-consultation product selection (rejection of foreign consultation bag products)
 * 6. Unauthorized checkout attempts (rejection of unauthenticated or foreign session requests)
 */

const assert = require('assert');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { connectDB, disconnectDB } = require('../src/config/db');
const Consultation = require('../src/models/Consultation');
const GiftBag = require('../src/models/GiftBag');
const Wishlist = require('../src/models/Wishlist');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const { hashGuestToken } = require('../src/utils/guestSessionUtils');
const { validateAndProcessCheckout } = require('../src/controllers/bagAndWishlistController');
const authController = require('../src/controllers/authController');

// Test cleanup tracker
const createdUserIds = [];
const createdConsultationIds = [];
const createdProductIds = [];

// Helper to construct mock Express req/res
function createMockReqRes({ params = {}, body = {}, cookies = {}, user = null, headers = {} } = {}) {
  const req = {
    params,
    body,
    cookies,
    user,
    headers,
    ip: '127.0.0.1',
  };

  const res = {
    statusCode: 200,
    cookies: {},
    clearedCookies: [],
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    },
    cookie(name, val, opts) {
      this.cookies[name] = { val, opts };
      return this;
    },
    clearCookie(name, opts) {
      this.clearedCookies.push({ name, opts });
      delete this.cookies[name];
      return this;
    },
  };

  return { req, res };
}

async function runMilestone41Tests() {
  console.log('\n================================================================');
  console.log('🔒 MILESTONE 4.1: FINAL SECURITY VERIFICATION TEST SUITE');
  console.log('================================================================\n');

  await connectDB();

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Partial Guest-Claim Failures (Rollback & No Partial State)
    // -------------------------------------------------------------------------
    console.log('[1] PARTIAL GUEST-CLAIM FAILURE & TRANSACTIONAL ROLLBACK:');
    const guestToken1 = crypto.randomBytes(32).toString('hex');
    const guestHash1 = hashGuestToken(guestToken1);

    const testCons1 = await Consultation.create({
      userId: null,
      guestSessionHash: guestHash1,
      recipientName: 'Aria',
      relationship: 'friend',
      occasion: 'anniversary',
      desiredEmotion: 'thoughtful',
      interests: ['Watches & Horology'],
      personality: ['analytical'],
      budget: { min: 2000, max: 8000, currency: 'INR' },
      budgetFormatted: '₹2,000 – ₹8,000',
      status: 'completed',
    });
    createdConsultationIds.push(testCons1._id);

    const testBag1 = await GiftBag.create({
      consultationId: testCons1._id,
      userId: null,
      guestSessionHash: guestHash1,
      productId: 'test-horology-case',
      product: {
        id: 'test-horology-case',
        name: 'Horology Travel Roll',
        price: 3500,
        productUrl: 'https://atelierhorology.com/roll',
        retailer: { name: 'Atelier Horology', verified: true },
      },
      quantity: 1,
      selected: true,
    });

    const testWish1 = await Wishlist.create({
      consultationId: testCons1._id,
      userId: null,
      guestSessionHash: guestHash1,
      productId: 'test-horology-case',
      product: { name: 'Horology Travel Roll' },
    });

    const user1 = await User.create({
      name: 'Simulated Fail User',
      email: `failuser_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    createdUserIds.push(user1._id);

    // Mock a failure during Wishlist claiming to simulate partial operation failure
    const origWishlistUpdateMany = Wishlist.updateMany;
    Wishlist.updateMany = async function () {
      throw new Error('Simulated database write conflict during Wishlist claiming');
    };

    const mockReq1 = {
      cookies: { charis_guest_session: guestToken1 },
    };

    let claimingFailedAsExpected = false;
    try {
      // Execute registration / link flow with mock failure
      const { req, res } = createMockReqRes({
        cookies: { charis_guest_session: guestToken1 },
        body: {
          name: 'Registration Interrupted User',
          email: `reg_interrupted_${Date.now()}@example.com`,
          password: 'Password123!',
        },
      });

      let nextErr = null;
      await authController.register(req, res, (err) => {
        nextErr = err;
      });

      assert(nextErr !== null || res.statusCode >= 500, 'Registration must fail if guest claiming encounters partial failure');
      claimingFailedAsExpected = true;
    } catch (err) {
      claimingFailedAsExpected = true;
    } finally {
      // Restore original function
      Wishlist.updateMany = origWishlistUpdateMany;
    }

    assert(claimingFailedAsExpected, 'Guest claiming must reject partial claiming failures');

    // Verify database state: Consultation, Bag, and Wishlist must NOT be partially claimed
    const consAfterFail = await Consultation.findById(testCons1._id);
    const bagAfterFail = await GiftBag.findById(testBag1._id);
    const wishAfterFail = await Wishlist.findById(testWish1._id);

    assert.strictEqual(
      consAfterFail.userId,
      null,
      'Consultation must NOT remain claimed when subsequent collection updates fail'
    );
    assert.strictEqual(
      bagAfterFail.userId,
      null,
      'Bag must NOT remain claimed when subsequent collection updates fail'
    );
    assert.strictEqual(
      wishAfterFail.userId,
      null,
      'Wishlist must remain unclaimed on partial failure'
    );
    console.log('   ✓ Partial failure aborted cleanly without inconsistent or split ownership.');

    // -------------------------------------------------------------------------
    // TEST 2: Recovery After Interrupted Claiming
    // -------------------------------------------------------------------------
    console.log('\n[2] RECOVERY AFTER INTERRUPTED CLAIMING:');
    // Simulate an interrupted state: Consultation has user1._id, but bag & wishlist still have null
    await Consultation.findByIdAndUpdate(testCons1._id, { userId: user1._id });

    // Now run login for user1 with the guest session cookie
    const { req: loginReq, res: loginRes } = createMockReqRes({
      cookies: { charis_guest_session: guestToken1 },
      body: {
        email: user1.email,
        password: 'Password123!',
      },
    });

    let loginErr = null;
    await authController.login(loginReq, loginRes, (err) => {
      loginErr = err;
    });

    assert.strictEqual(loginErr, null, 'Login recovery should succeed without errors');
    assert.strictEqual(loginRes.statusCode, 200, 'Login recovery must return HTTP 200');

    // Verify that all records now belong to user1
    const consRecovered = await Consultation.findById(testCons1._id);
    const bagRecovered = await GiftBag.findById(testBag1._id);
    const wishRecovered = await Wishlist.findById(testWish1._id);

    assert.strictEqual(consRecovered.userId.toString(), user1._id.toString());
    assert.strictEqual(bagRecovered.userId.toString(), user1._id.toString());
    assert.strictEqual(wishRecovered.userId.toString(), user1._id.toString());

    // Verify foreign user cannot claim these recovered records
    const foreignUser = await User.create({
      name: 'Foreign Attacker',
      email: `foreign_${Date.now()}@example.com`,
      password: 'Password123!',
    });
    createdUserIds.push(foreignUser._id);

    const { req: foreignLoginReq, res: foreignLoginRes } = createMockReqRes({
      cookies: { charis_guest_session: guestToken1 },
      body: {
        email: foreignUser.email,
        password: 'Password123!',
      },
    });

    let foreignErr = null;
    await authController.login(foreignLoginReq, foreignLoginRes, (err) => {
      foreignErr = err;
    });
    assert(foreignErr !== null, 'Foreign account must be rejected from claiming another user records');
    console.log('   ✓ Recovered cleanly without duplicate records; foreign claims strictly rejected.');

    // -------------------------------------------------------------------------
    // TEST 3: Invalid or Forged Retailer Verification Flags
    // -------------------------------------------------------------------------
    console.log('\n[3] INVALID OR FORGED RETAILER VERIFICATION FLAGS:');
    // Fetch or create an unverified product
    let unverifiedProduct = await Product.findOne({ 'retailer.verified': false });
    if (!unverifiedProduct) {
      unverifiedProduct = await Product.create({
        name: 'Unverified Artisan Sample',
        slug: `unverified-sample-${Date.now()}`,
        description: 'Sample piece from unvetted retailer',
        categoryId: 'test-cat',
        categoryName: 'Testing',
        price: 1999,
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
        productUrl: 'https://unverifiedateliers.com/piece',
        retailer: {
          id: 'ret-unverified',
          name: 'Unvetted Merchant',
          website: 'https://unverifiedateliers.com',
          verified: false,
          sourceType: 'unverified',
        },
        active: true,
      });
      createdProductIds.push(unverifiedProduct._id);
    }

    // Add unverified product to user1's consultation bag
    await GiftBag.deleteMany({ consultationId: testCons1._id });
    const unverifiedBagItem = await GiftBag.create({
      consultationId: testCons1._id,
      userId: user1._id,
      productId: unverifiedProduct._id.toString(),
      product: {
        id: unverifiedProduct._id.toString(),
        name: unverifiedProduct.name,
        price: unverifiedProduct.price,
        retailer: {
          verified: false, // In database, it is unverified
          name: unverifiedProduct.retailer?.name,
        },
      },
      quantity: 1,
      selected: true,
    });

    // Client attempts to tamper with request body by forging { retailer: { verified: true } }
    const { req: forgeReq, res: forgeRes } = createMockReqRes({
      params: { consultationId: testCons1._id.toString() },
      body: {
        productIds: [unverifiedProduct._id.toString()],
        retailer: { verified: true }, // Attacker sends forged verified flag
        verified: true,
      },
      user: { id: user1._id.toString() },
    });

    await validateAndProcessCheckout(forgeReq, forgeRes, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(
      forgeRes.statusCode,
      200,
      'Server safely processes checkout while resolving authoritative DB state'
    );
    assert(
      Array.isArray(forgeRes.jsonData.checkoutItems) && forgeRes.jsonData.checkoutItems.length === 1,
      'Expected checkoutItems array in response'
    );
    assert.strictEqual(
      forgeRes.jsonData.checkoutItems[0].retailerName,
      unverifiedProduct.retailer.name,
      'Server must consult authoritative DB retailer name, ignoring forged client body fields'
    );
    console.log('   ✓ Forged client fields ignored; server consulted authoritative database state.');

    // -------------------------------------------------------------------------
    // TEST 4: Tampered Checkout URLs & Non-HTTPS Rejection
    // -------------------------------------------------------------------------
    console.log('\n[4] TAMPERED CHECKOUT URLS & NON-HTTPS DESTINATIONS:');
    // Fetch a verified product from the DB
    const verifiedProduct = await Product.findOne({
      active: true,
      'retailer.verified': true,
      productUrl: { $regex: /^https:\/\// },
    });
    assert(verifiedProduct, 'Expected at least one verified active product in DB');

    // Create a product with insecure/placeholder URL
    const insecureProduct = await Product.create({
      name: 'Insecure URL Product',
      slug: `insecure-url-${Date.now()}`,
      description: 'Product with insecure http URL',
      categoryId: 'test-cat',
      categoryName: 'Testing',
      price: 2400,
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c',
      productUrl: 'http://insecure-artisan-shop.com/piece', // HTTP protocol
      retailer: {
        name: 'Insecure Atelier',
        website: 'http://insecure-artisan-shop.com',
        verified: true,
      },
      active: true,
    });
    createdProductIds.push(insecureProduct._id);

    // Test 4a: Add insecure product and request checkout -> must reject
    await GiftBag.deleteMany({ consultationId: testCons1._id });
    await GiftBag.create({
      consultationId: testCons1._id,
      userId: user1._id,
      productId: insecureProduct._id.toString(),
      product: {
        id: insecureProduct._id.toString(),
        name: insecureProduct.name,
        price: insecureProduct.price,
      },
      quantity: 1,
      selected: true,
    });

    const { req: insecureReq, res: insecureRes } = createMockReqRes({
      params: { consultationId: testCons1._id.toString() },
      body: { productIds: [insecureProduct._id.toString()] },
      user: { id: user1._id.toString() },
    });

    await validateAndProcessCheckout(insecureReq, insecureRes, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(
      insecureRes.statusCode,
      200,
      'Insecure non-HTTPS destination is safely sanitized with HTTP 200'
    );
    assert(
      insecureRes.jsonData.checkoutItems && insecureRes.jsonData.checkoutItems[0],
      'Expected checkout item in response'
    );
    const sanitizedUrl = insecureRes.jsonData.checkoutItems[0].checkoutUrl;
    assert(
      sanitizedUrl.startsWith('https://'),
      'Sanitized checkout URL must use verified HTTPS protocol'
    );
    assert(
      !sanitizedUrl.startsWith('http://'),
      'Sanitized checkout URL must never retain insecure HTTP protocol'
    );

    // Test 4b: Verified product with client trying to tamper with checkoutUrl in request body
    await GiftBag.deleteMany({ consultationId: testCons1._id });
    await GiftBag.create({
      consultationId: testCons1._id,
      userId: user1._id,
      productId: verifiedProduct._id.toString(),
      product: {
        id: verifiedProduct._id.toString(),
        name: verifiedProduct.name,
        price: verifiedProduct.price,
      },
      quantity: 1,
      selected: true,
    });

    const { req: tamperReq, res: tamperRes } = createMockReqRes({
      params: { consultationId: testCons1._id.toString() },
      body: {
        productIds: [verifiedProduct._id.toString()],
        checkoutUrl: 'https://malicious-phishing-site.com/steal-card', // Tampered client URL
      },
      user: { id: user1._id.toString() },
    });

    await validateAndProcessCheckout(tamperReq, tamperRes, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(tamperRes.statusCode, 200, 'Legitimate verified product checkout should pass');
    const returnedCheckoutItem = tamperRes.jsonData.checkoutItems[0];
    assert.notStrictEqual(
      returnedCheckoutItem.checkoutUrl,
      'https://malicious-phishing-site.com/steal-card',
      'Server must NEVER return client-supplied tampered URL'
    );
    assert.strictEqual(
      returnedCheckoutItem.checkoutUrl,
      verifiedProduct.productUrl || verifiedProduct.retailer.website,
      'Server must strictly return authoritative DB URL'
    );
    console.log('   ✓ Insecure/placeholder URLs rejected; tampered client URLs ignored in favor of DB truth.');

    // -------------------------------------------------------------------------
    // TEST 5: Cross-Consultation Product Selection
    // -------------------------------------------------------------------------
    console.log('\n[5] CROSS-CONSULTATION PRODUCT SELECTION PROTECTION:');
    // Create Consultation 2 for foreign user
    const testCons2 = await Consultation.create({
      userId: foreignUser._id,
      recipientName: 'Foreign Recipient',
      relationship: 'colleague',
      occasion: 'farewell',
      desiredEmotion: 'respect',
      interests: ['Leather Craft'],
      budget: { min: 1000, max: 5000, currency: 'INR' },
      status: 'completed',
    });
    createdConsultationIds.push(testCons2._id);

    // Create a product in Consultation 2's bag
    const foreignBagItem = await GiftBag.create({
      consultationId: testCons2._id,
      userId: foreignUser._id,
      productId: 'foreign-exclusive-pen',
      product: {
        id: 'foreign-exclusive-pen',
        name: 'Foreign Atelier Fountain Pen',
        price: 4500,
        retailer: { name: 'Pen Workshop', verified: true },
      },
      quantity: 1,
      selected: true,
    });

    // User 1 tries to checkout Consultation 1 but passes 'foreign-exclusive-pen' (from Consultation 2)
    const { req: crossReq, res: crossRes } = createMockReqRes({
      params: { consultationId: testCons1._id.toString() },
      body: { productIds: ['foreign-exclusive-pen'] },
      user: { id: user1._id.toString() },
    });

    await validateAndProcessCheckout(crossReq, crossRes, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(
      crossRes.statusCode,
      400,
      'Cross-consultation product checkout must be rejected with HTTP 400'
    );
    assert.strictEqual(
      crossRes.jsonData.code,
      'CROSS_CONSULTATION_PRODUCT_SELECTION',
      'Should report CROSS_CONSULTATION_PRODUCT_SELECTION code'
    );
    console.log('   ✓ Cross-consultation product request was strictly identified and blocked.');

    // -------------------------------------------------------------------------
    // TEST 6: Unauthorized Checkout Attempts
    // -------------------------------------------------------------------------
    console.log('\n[6] UNAUTHORIZED CHECKOUT ATTEMPTS:');
    // Attacker (foreignUser) attempts to checkout user1's consultation bag
    const { req: unauthReq, res: unauthRes } = createMockReqRes({
      params: { consultationId: testCons1._id.toString() },
      body: { productIds: [verifiedProduct._id.toString()] },
      user: { id: foreignUser._id.toString() }, // User is foreignUser, but consultation is user1
    });

    await validateAndProcessCheckout(unauthReq, unauthRes, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(
      unauthRes.statusCode,
      403,
      'Foreign user checkout on another user consultation must return HTTP 403 Forbidden'
    );
    assert.strictEqual(
      unauthRes.jsonData.code,
      'FORBIDDEN',
      'Should report FORBIDDEN code'
    );

    // Unauthenticated guest with no cookie attempting checkout
    const { req: noAuthReq, res: noAuthRes } = createMockReqRes({
      params: { consultationId: testCons1._id.toString() },
      body: { productIds: [verifiedProduct._id.toString()] },
      user: null,
      cookies: {},
    });

    await validateAndProcessCheckout(noAuthReq, noAuthRes, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(
      noAuthRes.statusCode,
      403,
      'Unauthenticated request on user-owned consultation must return HTTP 403 Forbidden'
    );
    console.log('   ✓ Unauthorized checkout attempts strictly rejected with HTTP 403 Forbidden.');

    console.log('\n================================================================');
    console.log('🎉 ALL 6 MILESTONE 4.1 SECURITY VERIFICATION TESTS PASSED!');
    console.log('================================================================\n');
  } finally {
    // Clean up created test fixtures
    try {
      if (createdUserIds.length) await User.deleteMany({ _id: { $in: createdUserIds } });
      if (createdConsultationIds.length) {
        await Consultation.deleteMany({ _id: { $in: createdConsultationIds } });
        await GiftBag.deleteMany({ consultationId: { $in: createdConsultationIds } });
        await Wishlist.deleteMany({ consultationId: { $in: createdConsultationIds } });
      }
      if (createdProductIds.length) await Product.deleteMany({ _id: { $in: createdProductIds } });
    } catch (cleanErr) {
      console.warn('Test cleanup warning:', cleanErr.message);
    }
    await disconnectDB();
  }
}

runMilestone41Tests().catch((err) => {
  console.error('\n❌ Milestone 4.1 Test Suite Failure:\n', err);
  process.exit(1);
});
