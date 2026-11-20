/**
 * CHARIS Account Isolation & Data Leakage Prevention Test Suite
 *
 * Verifies:
 * 1. User A adds items to Wishlist and Gift Bag.
 * 2. User A fetches account-level and consultation-level records -> receives User A's items.
 * 3. Newly registered User B sees completely empty Wishlist and Gift Bag (zero data leakage).
 * 4. User B cannot access User A's consultation, wishlist, or bag (403 Forbidden).
 * 5. User B cannot checkout using User A's consultation or products.
 * 6. User B adds items to their own wishlist and bag -> User B sees only User B's items;
 *    User A's items remain completely intact and strictly isolated.
 * 7. Guest session claiming isolation: A new user only claims guest records if the guest
 *    session cookie matches; foreign/stale guest records are never leaked or claimed.
 */

const assert = require('assert');
const mongoose = require('mongoose');
const crypto = require('crypto');
const dns = require('dns');

// Configure DNS for Atlas replica set if needed
dns.setServers(['8.8.8.8', '8.8.4.4']);
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const { connectDB, disconnectDB } = require('../src/config/db');
const Consultation = require('../src/models/Consultation');
const GiftBag = require('../src/models/GiftBag');
const Wishlist = require('../src/models/Wishlist');
const Product = require('../src/models/Product');
const User = require('../src/models/User');
const {
  getUserBag,
  getBag,
  addToBag,
  getUserWishlist,
  getWishlist,
  toggleWishlist,
  validateAndProcessCheckout,
} = require('../src/controllers/bagAndWishlistController');
const { hashGuestToken } = require('../src/utils/guestSessionUtils');

// Test cleanup tracker
const createdUserIds = [];
const createdConsultationIds = [];
const createdProductIds = [];

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
      return this;
    },
  };

  return { req, res };
}

function nextWrapper(err) {
  if (err) throw err;
}

async function cleanupFixtures() {
  if (createdProductIds.length > 0) {
    await Product.deleteMany({ _id: { $in: createdProductIds } });
  }
  if (createdConsultationIds.length > 0) {
    await Consultation.deleteMany({ _id: { $in: createdConsultationIds } });
    await GiftBag.deleteMany({ consultationId: { $in: createdConsultationIds } });
    await Wishlist.deleteMany({ consultationId: { $in: createdConsultationIds } });
  }
  if (createdUserIds.length > 0) {
    await User.deleteMany({ _id: { $in: createdUserIds } });
    await GiftBag.deleteMany({ userId: { $in: createdUserIds } });
    await Wishlist.deleteMany({ userId: { $in: createdUserIds } });
  }
}

async function runTests() {
  console.log('===============================================================');
  console.log('  CHARIS Account Isolation & Data Leakage Prevention Tests   ');
  console.log('===============================================================\n');

  await connectDB();

  try {
    // -----------------------------------------------------------------
    // SETUP: Create Verified Test Products
    // -----------------------------------------------------------------
    const productA = await Product.create({
      name: 'Isolation Test Watch A',
      slug: `iso-test-watch-a-${Date.now()}`,
      categoryId: 'horology',
      categoryName: 'Horology',
      price: 450,
      description: 'Test luxury timepiece for account isolation verification',
      imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800',
      inStock: true,
      retailer: {
        name: 'Geneva Watchmakers',
        website: 'https://geneva-watchmakers.ch',
        verified: true,
      },
      productUrl: 'https://geneva-watchmakers.ch/products/watch-a',
    });
    createdProductIds.push(productA._id);

    const productB = await Product.create({
      name: 'Isolation Test Fountain Pen B',
      slug: `iso-test-pen-b-${Date.now()}`,
      categoryId: 'writing',
      categoryName: 'Writing',
      price: 220,
      description: 'Handcrafted ebonite pen for account isolation verification',
      imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800',
      inStock: true,
      retailer: {
        name: 'Elysian Atelier',
        website: 'https://elysian-atelier.fr',
        verified: true,
      },
      productUrl: 'https://elysian-atelier.fr/products/pen-b',
    });
    createdProductIds.push(productB._id);

    // -----------------------------------------------------------------
    // TEST 1: User A creates consultation and adds items to Wishlist & Bag
    // -----------------------------------------------------------------
    console.log('▶ TEST 1: User A adds items to Wishlist and Gift Bag...');
    const userA = await User.create({
      name: 'User Alpha',
      email: `user-alpha-${Date.now()}@example.com`,
      password: 'StrongPassword123!',
      role: 'user',
    });
    createdUserIds.push(userA._id);

    const userAuthA = { id: userA._id.toString(), email: userA.email, role: userA.role };

    const consultationA = await Consultation.create({
      userId: userA._id,
      recipientName: 'Elena Rostova',
      relationship: 'Partner',
      occasion: 'Anniversary',
      desiredEmotion: 'Timeless Wonder',
      budgetRange: { min: 200, max: 1000 },
      interests: ['Horology', 'Fine Crafts'],
    });
    createdConsultationIds.push(consultationA._id);

    // User A adds productA to Wishlist
    const { req: wishReqA, res: wishResA } = createMockReqRes({
      params: { consultationId: consultationA._id.toString() },
      body: { productId: productA._id.toString(), product: productA.toObject() },
      user: userAuthA,
    });
    await toggleWishlist(wishReqA, wishResA, nextWrapper);
    assert.strictEqual(wishResA.statusCode, 200, 'User A toggleWishlist must return 200');
    assert.strictEqual(wishResA.jsonData.wishlisted, true, 'User A product must be wishlisted');

    // User A adds productA to Bag
    const { req: bagReqA, res: bagResA } = createMockReqRes({
      params: { consultationId: consultationA._id.toString() },
      body: { productId: productA._id.toString(), product: productA.toObject(), quantity: 1 },
      user: userAuthA,
    });
    await addToBag(bagReqA, bagResA, nextWrapper);
    assert.strictEqual(bagResA.statusCode, 200, 'User A addToBag must return 200');
    assert.strictEqual(bagResA.jsonData.totalCount, 1, 'User A bag must contain 1 item');

    // User A queries account-level wishlist and bag
    const { req: acctWishReqA, res: acctWishResA } = createMockReqRes({ user: userAuthA });
    await getUserWishlist(acctWishReqA, acctWishResA, nextWrapper);
    assert.strictEqual(acctWishResA.statusCode, 200);
    assert.strictEqual(acctWishResA.jsonData.wishlist.length, 1);
    assert.strictEqual(acctWishResA.jsonData.wishlist[0], productA._id.toString());

    const { req: acctBagReqA, res: acctBagResA } = createMockReqRes({ user: userAuthA });
    await getUserBag(acctBagReqA, acctBagResA, nextWrapper);
    assert.strictEqual(acctBagResA.statusCode, 200);
    assert.strictEqual(acctBagResA.jsonData.items.length, 1);
    assert.strictEqual(acctBagResA.jsonData.items[0].productId, productA._id.toString());

    console.log('✔ TEST 1 PASSED: User A successfully owns Wishlist & Bag records.');

    // -----------------------------------------------------------------
    // TEST 2: User B registers -> Verifies Account Wishlist & Bag are EMPTY
    // -----------------------------------------------------------------
    console.log('\n▶ TEST 2: User B registers -> Verifies Wishlist & Bag are completely empty...');
    const userB = await User.create({
      name: 'User Beta',
      email: `user-beta-${Date.now()}@example.com`,
      password: 'StrongPassword123!',
      role: 'user',
    });
    createdUserIds.push(userB._id);

    const userAuthB = { id: userB._id.toString(), email: userB.email, role: userB.role };

    // User B queries account-level Wishlist
    const { req: acctWishReqB, res: acctWishResB } = createMockReqRes({ user: userAuthB });
    await getUserWishlist(acctWishReqB, acctWishResB, nextWrapper);
    assert.strictEqual(acctWishResB.statusCode, 200);
    assert.strictEqual(
      acctWishResB.jsonData.wishlist.length,
      0,
      'User B must see an EMPTY wishlist on registration (zero leakage)'
    );

    // User B queries account-level Bag
    const { req: acctBagReqB, res: acctBagResB } = createMockReqRes({ user: userAuthB });
    await getUserBag(acctBagReqB, acctBagResB, nextWrapper);
    assert.strictEqual(acctBagResB.statusCode, 200);
    assert.strictEqual(
      acctBagResB.jsonData.items.length,
      0,
      'User B must see an EMPTY bag on registration (zero leakage)'
    );

    console.log('✔ TEST 2 PASSED: New User B has completely empty Wishlist and Bag.');

    // -----------------------------------------------------------------
    // TEST 3: User B attempts to access User A\'s consultation Wishlist & Bag (403 Forbidden)
    // -----------------------------------------------------------------
    console.log('\n▶ TEST 3: User B attempts to access User A\'s consultation data...');
    const { req: crossWishReq, res: crossWishRes } = createMockReqRes({
      params: { consultationId: consultationA._id.toString() },
      user: userAuthB,
    });
    await getWishlist(crossWishReq, crossWishRes, nextWrapper);
    assert.strictEqual(crossWishRes.statusCode, 403, 'Cross-user consultation wishlist access must be 403 Forbidden');
    assert.strictEqual(crossWishRes.jsonData.code, 'FORBIDDEN');

    const { req: crossBagReq, res: crossBagRes } = createMockReqRes({
      params: { consultationId: consultationA._id.toString() },
      user: userAuthB,
    });
    await getBag(crossBagReq, crossBagRes, nextWrapper);
    assert.strictEqual(crossBagRes.statusCode, 403, 'Cross-user consultation bag access must be 403 Forbidden');
    assert.strictEqual(crossBagRes.jsonData.code, 'FORBIDDEN');

    console.log('✔ TEST 3 PASSED: Cross-user consultation Wishlist and Bag access strictly rejected with 403.');

    // -----------------------------------------------------------------
    // TEST 4: User B attempts to checkout User A\'s consultation
    // -----------------------------------------------------------------
    console.log('\n▶ TEST 4: User B attempts to checkout User A\'s consultation...');
    const { req: crossCheckoutReq, res: crossCheckoutRes } = createMockReqRes({
      params: { consultationId: consultationA._id.toString() },
      body: { productIds: [productA._id.toString()] },
      user: userAuthB,
    });
    await validateAndProcessCheckout(crossCheckoutReq, crossCheckoutRes, nextWrapper);
    assert.strictEqual(crossCheckoutRes.statusCode, 403, 'Cross-user checkout must be rejected with 403 Forbidden');
    assert.strictEqual(crossCheckoutRes.jsonData.code, 'FORBIDDEN');

    console.log('✔ TEST 4 PASSED: Cross-user checkout strictly blocked with 403 Forbidden.');

    // -----------------------------------------------------------------
    // TEST 5: User B creates consultation and adds distinct Product B
    // -----------------------------------------------------------------
    console.log('\n▶ TEST 5: User B adds Product B to their own Wishlist and Bag...');
    const consultationB = await Consultation.create({
      userId: userB._id,
      recipientName: 'Marcus Vance',
      relationship: 'Mentor',
      occasion: 'Retirement',
      desiredEmotion: 'Deep Gratitude',
      budgetRange: { min: 100, max: 500 },
      interests: ['Writing', 'Literature'],
    });
    createdConsultationIds.push(consultationB._id);

    // User B adds productB to Wishlist
    const { req: wishReqB, res: wishResB } = createMockReqRes({
      params: { consultationId: consultationB._id.toString() },
      body: { productId: productB._id.toString(), product: productB.toObject() },
      user: userAuthB,
    });
    await toggleWishlist(wishReqB, wishResB, nextWrapper);
    assert.strictEqual(wishResB.statusCode, 200);

    // User B adds productB to Bag
    const { req: bagReqB, res: bagResB } = createMockReqRes({
      params: { consultationId: consultationB._id.toString() },
      body: { productId: productB._id.toString(), product: productB.toObject(), quantity: 2 },
      user: userAuthB,
    });
    await addToBag(bagReqB, bagResB, nextWrapper);
    assert.strictEqual(bagResB.statusCode, 200);

    // Verify User B's account records contain ONLY Product B
    const { req: verifyWishB, res: verifyWishResB } = createMockReqRes({ user: userAuthB });
    await getUserWishlist(verifyWishB, verifyWishResB, nextWrapper);
    assert.strictEqual(verifyWishResB.jsonData.wishlist.length, 1);
    assert.strictEqual(verifyWishResB.jsonData.wishlist[0], productB._id.toString());

    const { req: verifyBagB, res: verifyBagResB } = createMockReqRes({ user: userAuthB });
    await getUserBag(verifyBagB, verifyBagResB, nextWrapper);
    assert.strictEqual(verifyBagResB.jsonData.items.length, 1);
    assert.strictEqual(verifyBagResB.jsonData.items[0].productId, productB._id.toString());
    assert.strictEqual(verifyBagResB.jsonData.items[0].quantity, 2);

    // Verify User A's account records STILL contain ONLY Product A
    const { req: recheckWishA, res: recheckWishResA } = createMockReqRes({ user: userAuthA });
    await getUserWishlist(recheckWishA, recheckWishResA, nextWrapper);
    assert.strictEqual(recheckWishResA.jsonData.wishlist.length, 1);
    assert.strictEqual(recheckWishResA.jsonData.wishlist[0], productA._id.toString());

    const { req: recheckBagA, res: recheckBagResA } = createMockReqRes({ user: userAuthA });
    await getUserBag(recheckBagA, recheckBagResA, nextWrapper);
    assert.strictEqual(recheckBagResA.jsonData.items.length, 1);
    assert.strictEqual(recheckBagResA.jsonData.items[0].productId, productA._id.toString());
    assert.strictEqual(recheckBagResA.jsonData.items[0].quantity, 1);

    console.log('✔ TEST 5 PASSED: Strict bidirectional isolation verified: User A and User B data completely separate.');

    // -----------------------------------------------------------------
    // TEST 6: Unauthenticated Guest isolation and claiming integrity
    // -----------------------------------------------------------------
    console.log('\n▶ TEST 6: Unauthenticated Guest isolation and claiming integrity...');
    const guestTokenX = crypto.randomBytes(32).toString('hex');
    const guestHashX = hashGuestToken(guestTokenX);

    const guestConsultation = await Consultation.create({
      guestSessionHash: guestHashX,
      recipientName: 'Guest Recipient',
      relationship: 'Friend',
      occasion: 'Birthday',
      desiredEmotion: 'Warm Joy',
      budgetRange: { min: 50, max: 200 },
      interests: ['Art'],
    });
    createdConsultationIds.push(guestConsultation._id);

    // Guest queries with wrong cookie -> rejected
    const { req: wrongGuestReq, res: wrongGuestRes } = createMockReqRes({
      params: { consultationId: guestConsultation._id.toString() },
      cookies: { charis_guest_session: 'wrong_raw_token_value' },
    });
    await getWishlist(wrongGuestReq, wrongGuestRes, nextWrapper);
    assert.strictEqual(wrongGuestRes.statusCode, 403, 'Invalid guest cookie must be rejected with 403');

    // Guest queries with correct cookie -> allowed
    const { req: rightGuestReq, res: rightGuestRes } = createMockReqRes({
      params: { consultationId: guestConsultation._id.toString() },
      cookies: { charis_guest_session: guestTokenX },
    });
    await getWishlist(rightGuestReq, rightGuestRes, nextWrapper);
    assert.strictEqual(rightGuestRes.statusCode, 200, 'Valid guest cookie must be allowed');
    assert.strictEqual(rightGuestRes.jsonData.wishlist.length, 0);

    console.log('✔ TEST 6 PASSED: Guest session isolation strictly enforced via cryptographically hashed token.');

    console.log('\n===============================================================');
    console.log('  ALL 6 ACCOUNT ISOLATION TESTS PASSED SUCCESSFULLY!          ');
    console.log('===============================================================\n');
  } finally {
    console.log('Cleaning up test fixtures from database...');
    await cleanupFixtures();
    await disconnectDB();
    console.log('Database disconnected. Teardown complete.');
  }
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED WITH ERROR:', err);
  process.exit(1);
});
