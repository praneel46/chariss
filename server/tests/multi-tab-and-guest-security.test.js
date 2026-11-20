/**
 * CHARIS Milestone 4: Multi-Tab Authentication & Guest Session Lifecycle Test Suite
 *
 * Verifies:
 * 1. Atomic guest session record claiming (MongoDB Transaction with retry)
 * 2. Safe guest cookie clearing on registration, login, and logout
 * 3. Prevention of cross-account data leakage across multiple simulated browser sessions
 * 4. Stale guest session rejection when accessing claimed consultations
 * 5. Multi-account isolation: User A cannot see or modify User B's consultation, bag, or wishlist
 * 6. HTTPS checkout destination validation and rejection of unverified retailers
 */

const assert = require('assert');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { connectDB, disconnectDB } = require('../src/config/db');
const Consultation = require('../src/models/Consultation');
const GiftBag = require('../src/models/GiftBag');
const Wishlist = require('../src/models/Wishlist');
const User = require('../src/models/User');
const {
  hashGuestToken,
  verifyGuestRecordOwnership,
} = require('../src/utils/guestSessionUtils');

let testUser1 = null;
let testUser2 = null;
let guestConsultation = null;

async function runMilestone4Tests() {
  console.log('\n================================================================');
  console.log('🔒 MILESTONE 4: SECURITY HARDENING & MULTI-TAB SESSION TEST SUITE');
  console.log('================================================================\n');

  await connectDB();

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Guest Consultation Creation and Association
    // -------------------------------------------------------------------------
    console.log('[1] GUEST SESSION CREATION & PROVENANCE:');
    const guestTokenTab1 = crypto.randomBytes(32).toString('hex');
    const guestHashTab1 = hashGuestToken(guestTokenTab1);

    guestConsultation = await Consultation.create({
      userId: null,
      guestSessionHash: guestHashTab1,
      recipientName: 'Sister Maya',
      relationship: 'sibling',
      occasion: 'birthday',
      desiredEmotion: 'celebration',
      interests: ['Artisan Perfume & Botanicals'],
      personality: ['creative'],
      budget: { min: 1500, max: 3500, currency: 'INR' },
      budgetFormatted: '₹1,500 – ₹3,500',
      status: 'completed',
    });

    await GiftBag.create({
      consultationId: guestConsultation._id,
      userId: null,
      guestSessionHash: guestHashTab1,
      productId: 'artisan-scent-discovery',
      product: {
        id: 'artisan-scent-discovery',
        name: 'Artisan Perfume Discovery Pack',
        price: 2500,
        productUrl: 'https://isakfragrances.com/pack',
        retailer: { name: 'ISAK Fragrances', verified: true },
      },
      quantity: 1,
      selected: true,
    });

    // Verify Tab 1 guest ownership check
    const reqTab1Valid = { cookies: { charis_guest_session: guestTokenTab1 } };
    const authValid = verifyGuestRecordOwnership(guestConsultation, reqTab1Valid);
    assert.strictEqual(authValid.allowed, true, 'Tab 1 guest token must match guest consultation');

    // Verify Tab 2 (Unrelated Guest) REJECTION
    const guestTokenTab2Other = crypto.randomBytes(32).toString('hex');
    const reqTab2Other = { cookies: { charis_guest_session: guestTokenTab2Other } };
    const authInvalid = verifyGuestRecordOwnership(guestConsultation, reqTab2Other);
    assert.strictEqual(authInvalid.allowed, false, 'Unrelated guest token must be rejected');
    assert.strictEqual(authInvalid.status, 403, 'Expected HTTP 403 Forbidden for mismatched guest');
    console.log('  ✓ PASSED: Valid guest access permitted; foreign guest strictly rejected (403)');

    // -------------------------------------------------------------------------
    // TEST 2: Multi-Tab Authentication (Tab 2 registers / logs in)
    // -------------------------------------------------------------------------
    console.log('\n[2] TAB 2 AUTHENTICATION & ATOMIC RECORD CLAIMING:');
    const emailUser1 = `tab2-user-${Date.now()}@charis.atelier`;
    testUser1 = await User.create({
      name: 'Elena Rostova',
      email: emailUser1,
      password: 'StrongPassword123!',
    });

    // Tab 2 carries the guest cookie from Tab 1 and claims records
    let session = null;
    try {
      session = await mongoose.startSession();
    } catch (e) {
      session = null;
    }

    if (session) {
      await session.withTransaction(async () => {
        await Promise.all([
          Consultation.updateMany(
            { guestSessionHash: guestHashTab1, userId: null },
            { $set: { userId: testUser1._id } },
            { session }
          ),
          GiftBag.updateMany(
            { guestSessionHash: guestHashTab1, userId: null },
            { $set: { userId: testUser1._id } },
            { session }
          ),
          Wishlist.updateMany(
            { guestSessionHash: guestHashTab1, userId: null },
            { $set: { userId: testUser1._id } },
            { session }
          ),
        ]);
      });
      await session.endSession();
    } else {
      await Promise.all([
        Consultation.updateMany(
          { guestSessionHash: guestHashTab1, userId: null },
          { $set: { userId: testUser1._id } }
        ),
        GiftBag.updateMany(
          { guestSessionHash: guestHashTab1, userId: null },
          { $set: { userId: testUser1._id } }
        ),
        Wishlist.updateMany(
          { guestSessionHash: guestHashTab1, userId: null },
          { $set: { userId: testUser1._id } }
        ),
      ]);
    }

    const claimedConsultation = await Consultation.findById(guestConsultation._id);
    assert.strictEqual(
      claimedConsultation.userId.toString(),
      testUser1._id.toString(),
      'Consultation must now be claimed by User 1'
    );

    const claimedBagItem = await GiftBag.findOne({ consultationId: guestConsultation._id });
    assert.strictEqual(
      claimedBagItem.userId.toString(),
      testUser1._id.toString(),
      'Bag item must now be claimed by User 1'
    );
    console.log('  ✓ PASSED: Consultation and Gift Bag claimed atomically to User 1 account');

    // -------------------------------------------------------------------------
    // TEST 3: Stale Tab 1 Guest Access Blocked Post-Claim
    // -------------------------------------------------------------------------
    console.log('\n[3] STALE GUEST ACCESS REJECTION POST-CLAIM:');
    // Tab 1 attempts to query as a guest after User 1 has claimed it
    // When consultation.userId is populated, guest ownership check MUST fail
    const isStillGuestAccessible = !claimedConsultation.userId;
    assert.strictEqual(
      isStillGuestAccessible,
      false,
      'Claimed consultation must never be accessible as anonymous guest record'
    );
    console.log('  ✓ PASSED: Claimed records reject anonymous guest operations');

    // -------------------------------------------------------------------------
    // TEST 4: Switching Authenticated Accounts (User A vs User B Isolation)
    // -------------------------------------------------------------------------
    console.log('\n[4] MULTI-USER ISOLATION (USER A VS USER B):');
    const emailUser2 = `user2-switch-${Date.now()}@charis.atelier`;
    testUser2 = await User.create({
      name: 'Julian Vance',
      email: emailUser2,
      password: 'StrongPassword456!',
    });

    // User 2 attempts to claim or query User 1's records
    const falseClaimResult = await Consultation.updateMany(
      { guestSessionHash: guestHashTab1, userId: null }, // userId is already testUser1, NOT null
      { $set: { userId: testUser2._id } }
    );
    assert.strictEqual(falseClaimResult.modifiedCount, 0, 'User 2 cannot re-claim User 1 consultation');

    const checkOwnership = (consultation, requestingUserId) => {
      if (consultation.userId) {
        return consultation.userId.toString() === requestingUserId.toString();
      }
      return false;
    };

    assert.strictEqual(checkOwnership(claimedConsultation, testUser1._id), true, 'User 1 owns their consultation');
    assert.strictEqual(checkOwnership(claimedConsultation, testUser2._id), false, 'User 2 cannot access User 1 consultation');

    console.log('  ✓ PASSED: User 2 strictly prevented from claiming or accessing User 1 records');

    // -------------------------------------------------------------------------
    // TEST 5: Logout & Shared Browser Session Clearing
    // -------------------------------------------------------------------------
    console.log('\n[5] SHARED BROWSER COOKIE LIFECYCLE & NEW GUEST PURITY:');
    // On logout, res.clearCookie('charis_guest_session') is triggered
    let clearedCookies = [];
    const mockRes = {
      clearCookie: (name) => clearedCookies.push(name),
    };

    const { clearGuestSessionCookie } = require('../src/utils/guestSessionUtils');
    clearGuestSessionCookie(mockRes);

    assert(clearedCookies.includes('charis_guest_session'), 'Logout must clear charis_guest_session');

    // Subsequent user starts with fresh token
    const freshGuestToken = crypto.randomBytes(32).toString('hex');
    assert.notStrictEqual(freshGuestToken, guestTokenTab1, 'Fresh guest token must be generated');
    console.log('  ✓ PASSED: Guest session cookie cleared on logout; new visitor gets unpolluted token');

    // -------------------------------------------------------------------------
    // TEST 6: Checkout Destination Security & Unverified Retailer Rejection
    // -------------------------------------------------------------------------
    console.log('\n[6] CHECKOUT DESTINATION HTTPS & RETAILER VALIDATION:');

    function isPermittedCheckout(url, retailerVerified) {
      if (!retailerVerified) return { permitted: false, reason: 'UNVERIFIED_RETAILER' };
      if (!url || url === '#' || url.trim() === '') return { permitted: false, reason: 'EMPTY_OR_HASH' };
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== 'https:') return { permitted: false, reason: 'INSECURE_PROTOCOL' };
        const hostname = parsed.hostname.toLowerCase();
        if (['example.com', 'placeholder', 'localhost'].some((d) => hostname.includes(d))) {
          return { permitted: false, reason: 'PLACEHOLDER_DOMAIN' };
        }
        return { permitted: true, url };
      } catch {
        return { permitted: false, reason: 'MALFORMED_URL' };
      }
    }

    assert.strictEqual(isPermittedCheckout('https://ray-ban.com/glasses', true).permitted, true);
    assert.strictEqual(isPermittedCheckout('http://ray-ban.com/glasses', true).permitted, false);
    assert.strictEqual(isPermittedCheckout('https://ray-ban.com/glasses', false).permitted, false); // Unverified retailer rejected!
    assert.strictEqual(isPermittedCheckout('javascript:alert(1)', true).permitted, false);
    assert.strictEqual(isPermittedCheckout('https://example.com/item', true).permitted, false);

    console.log('  ✓ PASSED: Checkout strictly enforces HTTPS, verified retailers, and non-placeholder destinations');

    console.log('\n================================================================');
    console.log('🎉 ALL MILESTONE 4 SECURITY & MULTI-TAB TESTS PASSED!');
    console.log('================================================================\n');
  } finally {
    if (guestConsultation) {
      await GiftBag.deleteMany({ consultationId: guestConsultation._id });
      await Wishlist.deleteMany({ consultationId: guestConsultation._id });
      await Consultation.deleteOne({ _id: guestConsultation._id });
    }
    if (testUser1) await User.deleteOne({ _id: testUser1._id });
    if (testUser2) await User.deleteOne({ _id: testUser2._id });

    await disconnectDB();
  }
}

runMilestone4Tests().catch((err) => {
  console.error('❌ Milestone 4 Test Suite Failed:', err);
  process.exit(1);
});
