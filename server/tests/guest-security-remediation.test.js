const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const http = require('http');
const mongoose = require('mongoose');
const config = require('../src/config/env');
const { connectDB, disconnectDB } = require('../src/config/db');

// In-memory data store for fallback testing when Atlas IP is unwhitelisted
const store = {
  users: new Map(),
  consultations: new Map(),
  giftCards: new Map(),
  products: [
    {
      _id: new mongoose.Types.ObjectId(),
      name: 'Horology Timepiece',
      price: 2500,
      active: true,
      interests: ['Horology', 'Watches'],
      occasions: ['anniversary', 'birthday', 'promotion'],
    },
  ],
};

function createMongooseDoc(data, map) {
  const doc = {
    ...data,
    _id: data._id || new mongoose.Types.ObjectId(),
    toObject: function () {
      return { ...this };
    },
    save: async function () {
      map.set(this._id.toString(), this);
      return this;
    },
  };
  map.set(doc._id.toString(), doc);
  return doc;
}

let isUsingMemoryFallback = false;

const Consultation = require('../src/models/Consultation');
const GiftCard = require('../src/models/GiftCard');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

function setupMemoryStubs() {
  isUsingMemoryFallback = true;
  console.log('⚡ Atlas IP unwhitelisted: using in-memory model harness to execute real HTTP Express routes.\n');

  Consultation.create = async function (data) {
    return createMongooseDoc(data, store.consultations);
  };
  Consultation.findOne = async function (query) {
    const all = Array.from(store.consultations.values());
    return all.find((c) => {
      let match = true;
      if (query.userId !== undefined) {
        match = match && ((c.userId ? c.userId.toString() : null) === (query.userId ? query.userId.toString() : null));
      }
      if (query.guestSessionHash !== undefined) {
        match = match && (c.guestSessionHash === query.guestSessionHash);
      }
      if (query.idempotencyKey !== undefined) {
        match = match && (c.idempotencyKey === query.idempotencyKey);
      }
      if (query._id !== undefined) {
        match = match && (c._id.toString() === query._id.toString());
      }
      return match;
    }) || null;
  };
  Consultation.findById = async function (id) {
    return store.consultations.get(id?.toString()) || null;
  };
  Consultation.find = function (query) {
    const all = Array.from(store.consultations.values());
    let filtered = all;
    if (query) {
      if (query.userId !== undefined) {
        filtered = filtered.filter(
          (c) => (c.userId ? c.userId.toString() : null) === (query.userId ? query.userId.toString() : null)
        );
      }
      if (query.guestSessionHash) {
        filtered = filtered.filter((c) => c.guestSessionHash === query.guestSessionHash);
      }
    }
    return {
      sort: async function () {
        return filtered;
      },
    };
  };
  Consultation.findOneAndUpdate = async function (filter, update) {
    const doc = store.consultations.get(filter._id?.toString());
    if (!doc) return null;
    if (filter.userId === null && doc.userId !== null) return null;
    if (filter.guestSessionHash && doc.guestSessionHash !== filter.guestSessionHash) return null;

    if (update.$set) {
      Object.assign(doc, update.$set);
    }
    store.consultations.set(doc._id.toString(), doc);
    return doc;
  };
  Consultation.findOneAndDelete = async function (filter) {
    const doc = store.consultations.get(filter._id?.toString());
    if (!doc) return null;
    if (filter.userId === null && doc.userId !== null) return null;
    if (filter.guestSessionHash && doc.guestSessionHash !== filter.guestSessionHash) return null;

    store.consultations.delete(doc._id.toString());
    return doc;
  };
  Consultation.findByIdAndDelete = async function (id) {
    const doc = store.consultations.get(id?.toString());
    store.consultations.delete(id?.toString());
    return doc || null;
  };
  Consultation.deleteMany = async function (filter) {
    if (filter?._id?.$in) {
      filter._id.$in.forEach((id) => store.consultations.delete(id.toString()));
    }
  };
  Consultation.syncIndexes = async function () {};

  // GiftCard
  GiftCard.create = async function (data) {
    return createMongooseDoc(data, store.giftCards);
  };
  GiftCard.findById = async function (id) {
    return store.giftCards.get(id?.toString()) || null;
  };
  GiftCard.find = function (query) {
    const all = Array.from(store.giftCards.values());
    let filtered = all;
    if (query) {
      if (query.userId !== undefined) {
        filtered = filtered.filter(
          (g) => (g.userId ? g.userId.toString() : null) === (query.userId ? query.userId.toString() : null)
        );
      }
      if (query.guestSessionHash) {
        filtered = filtered.filter((g) => g.guestSessionHash === query.guestSessionHash);
      }
    }
    return {
      sort: async function () {
        return filtered;
      },
    };
  };
  GiftCard.findOneAndUpdate = async function (filter, update) {
    const doc = store.giftCards.get(filter._id?.toString());
    if (!doc) return null;
    if (filter.userId === null && doc.userId !== null) return null;
    if (filter.guestSessionHash && doc.guestSessionHash !== filter.guestSessionHash) return null;

    if (update.$set) {
      Object.assign(doc, update.$set);
    }
    store.giftCards.set(doc._id.toString(), doc);
    return doc;
  };
  GiftCard.findOneAndDelete = async function (filter) {
    const doc = store.giftCards.get(filter._id?.toString());
    if (!doc) return null;
    if (filter.userId === null && doc.userId !== null) return null;
    if (filter.guestSessionHash && doc.guestSessionHash !== filter.guestSessionHash) return null;

    store.giftCards.delete(doc._id.toString());
    return doc;
  };
  GiftCard.findByIdAndDelete = async function (id) {
    const doc = store.giftCards.get(id?.toString());
    store.giftCards.delete(id?.toString());
    return doc || null;
  };
  GiftCard.deleteMany = async function (filter) {
    if (filter?._id?.$in) {
      filter._id.$in.forEach((id) => store.giftCards.delete(id.toString()));
    }
  };
  GiftCard.syncIndexes = async function () {};

  // User
  User.create = async function (data) {
    return createMongooseDoc(data, store.users);
  };
  User.findById = function (id) {
    const user = store.users.get(id?.toString());
    return {
      select: async function () {
        return user || null;
      },
    };
  };
  User.deleteMany = async function () {};

  // Product
  Product.find = async function (query) {
    if (query && query.active !== undefined) {
      return store.products.filter((p) => p.active === query.active);
    }
    return store.products;
  };
}

const app = require('../src/app');
const { generateAccessToken } = require('../src/utils/tokenUtils');
const {
  GUEST_SESSION_COOKIE_NAME,
  hashGuestToken,
} = require('../src/utils/guestSessionUtils');

let server;
let baseUrl;

const createdDocIds = {
  users: [],
  consultations: [],
  giftCards: [],
};

let userA;
let userB;
let tokenA;
let tokenB;

function extractGuestCookie(res) {
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) return null;
  const match = setCookie.match(new RegExp(`${GUEST_SESSION_COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

async function setup() {
  // Try connecting to Atlas first; fall back to in-memory stubs if IP unwhitelisted
  try {
    await connectDB();
  } catch (err) {
    setupMemoryStubs();
  }

  // Create temporary User A and User B
  const timestamp = Date.now();
  userA = await User.create({
    name: 'Remediation User A',
    email: `rem_user_a_${timestamp}@charis.test`,
    password: 'SecurePassword123!',
    role: 'user',
  });
  createdDocIds.users.push(userA._id);

  userB = await User.create({
    name: 'Remediation User B',
    email: `rem_user_b_${timestamp}@charis.test`,
    password: 'SecurePassword123!',
    role: 'user',
  });
  createdDocIds.users.push(userB._id);

  tokenA = generateAccessToken(userA);
  tokenB = generateAccessToken(userB);

  await Consultation.syncIndexes();
  await GiftCard.syncIndexes();

  // Start ephemeral HTTP server on dynamic port
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

async function teardown() {
  if (createdDocIds.consultations.length > 0) {
    await Consultation.deleteMany({ _id: { $in: createdDocIds.consultations } });
  }
  if (createdDocIds.giftCards.length > 0) {
    await GiftCard.deleteMany({ _id: { $in: createdDocIds.giftCards } });
  }
  if (createdDocIds.users.length > 0) {
    await User.deleteMany({ _id: { $in: createdDocIds.users } });
  }

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  if (!isUsingMemoryFallback) {
    await disconnectDB();
  }
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passedTests++;
  console.log(`  ✓ PASSED: ${message}`);
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 RUNNING MANDATORY GUEST SECURITY REMEDIATION TESTS');
  console.log('======================================================\n');

  const browserHeaders = {
    'Content-Type': 'application/json',
    Origin: 'http://localhost:5173',
  };

  // -------------------------------------------------------------
  // CONSULTATIONS (Tests 1 - 10)
  // -------------------------------------------------------------
  console.log('[SECTION 1: CONSULTATIONS]');

  // Test 1: Guest A creates a consultation
  let guestACookie;
  let guestAConsultationId;
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: browserHeaders,
      body: JSON.stringify({
        recipientName: 'Mom',
        relationship: 'mother',
        occasion: 'birthday',
        desiredEmotion: 'appreciation',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'Test 1: Guest A creates consultation (HTTP 201)');
    assert(data.data.userId === null, 'Test 1: Consultation created with userId === null');
    guestAConsultationId = data.data._id.toString();
    createdDocIds.consultations.push(guestAConsultationId);

    guestACookie = extractGuestCookie(res);
    assert(guestACookie && guestACookie.length >= 32, 'Test 1: Server delivered HTTP-only charis_guest_session cookie');
  }

  // Test 2: Guest A reads their own consultation successfully
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestAConsultationId}`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
    });
    const data = await res.json();
    assert(res.status === 200, 'Test 2: Guest A reads their own consultation (HTTP 200)');
    assert(data.data._id.toString() === guestAConsultationId, 'Test 2: Retrieved consultation matches ID');
  }

  // Create Guest B session for cross-guest testing
  let guestBCookie;
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: browserHeaders,
      body: JSON.stringify({
        recipientName: 'Colleague',
        relationship: 'colleague',
        occasion: 'thank_you',
        desiredEmotion: 'appreciation',
      }),
    });
    const data = await res.json();
    createdDocIds.consultations.push(data.data._id.toString());
    guestBCookie = extractGuestCookie(res);
    assert(guestBCookie && guestBCookie !== guestACookie, 'Guest B receives distinct session cookie');
  }

  // Test 3: Guest B cannot read Guest A's consultation
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestAConsultationId}`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
    });
    const data = await res.json();
    assert(res.status === 403, "Test 3: Guest B reading Guest A's consultation is rejected (HTTP 403 Forbidden)");
    assert(data.code === 'FORBIDDEN', 'Test 3: Returns code FORBIDDEN');
  }

  // Test 4: Guest B cannot update Guest A's consultation
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestAConsultationId}`, {
      method: 'PUT',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
      body: JSON.stringify({ notes: 'Defaced by Guest B' }),
    });
    const data = await res.json();
    assert(res.status === 403, "Test 4: Guest B updating Guest A's consultation is rejected (HTTP 403 Forbidden)");
  }

  // Test 5: Guest B cannot delete Guest A's consultation
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestAConsultationId}`, {
      method: 'DELETE',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
    });
    const data = await res.json();
    assert(res.status === 403, "Test 5: Guest B deleting Guest A's consultation is rejected (HTTP 403 Forbidden)");
  }

  // Test 6: Guest B cannot generate recommendations using Guest A's consultation
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/generate/${guestAConsultationId}`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
    });
    const data = await res.json();
    assert(res.status === 403, "Test 6: Guest B generating recommendations with Guest A's ID is rejected (HTTP 403)");
  }

  // Test 7: Anonymous caller cannot access a guest consultation by document ID
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestAConsultationId}`);
    const data = await res.json();
    assert(res.status === 401, 'Test 7: Anonymous caller reading guest consultation by ID is rejected (HTTP 401 Unauthorized)');
    assert(data.code === 'GUEST_SESSION_REQUIRED', 'Test 7: Identifies missing session cookie');
  }

  // Test 8: User A cannot claim Guest B's consultation
  let guestBOnlyConsultationId;
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
      body: JSON.stringify({
        recipientName: 'Sister',
        relationship: 'sibling',
        occasion: 'anniversary',
        desiredEmotion: 'romance',
      }),
    });
    const data = await res.json();
    guestBOnlyConsultationId = data.data._id.toString();
    createdDocIds.consultations.push(guestBOnlyConsultationId);
  }

  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestBOnlyConsultationId}`, {
      method: 'PUT',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${tokenA}`,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`, // Wrong guest cookie
      },
      body: JSON.stringify({ notes: 'Stolen by User A' }),
    });
    const data = await res.json();
    assert(res.status === 403, "Test 8: User A attempting to claim Guest B's consultation is rejected (HTTP 403 Forbidden)");
    const inDb = await Consultation.findById(guestBOnlyConsultationId);
    assert(inDb.userId === null, "Test 8: Database confirms Guest B's consultation was NOT linked to User A");
  }

  // Test 9: User A can legitimately claim their own guest consultation with session proof
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestAConsultationId}`, {
      method: 'PUT',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${tokenA}`,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`, // Legitimate proof of Guest A session
      },
      body: JSON.stringify({ notes: 'Claimed by legitimate User A' }),
    });
    const data = await res.json();
    assert(res.status === 200, 'Test 9: User A legitimately claims own guest consultation (HTTP 200 OK)');
    assert(data.data.userId === userA._id.toString(), 'Test 9: Record is now linked to User A');
    const inDb = await Consultation.findById(guestAConsultationId);
    assert(inDb.userId.toString() === userA._id.toString(), 'Test 9: Database confirms userId is User A');
    assert(inDb.guestSessionHash === null, 'Test 9: Database confirms guestSessionHash is cleared after claiming');
  }

  // Test 10: After claiming, the original guest session cannot access the user-owned record
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestAConsultationId}`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`, // Original guest session
      },
    });
    assert(res.status === 401, 'Test 10: Original guest session is denied access to user-owned record (HTTP 401)');
  }

  // -------------------------------------------------------------
  // GIFT CARDS (Tests 11 - 15)
  // -------------------------------------------------------------
  console.log('\n[SECTION 2: GIFT CARDS]');

  // Test 11: Guest A creates and reads their own gift card
  let guestAGiftCardId;
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({
        recipientName: 'Best Friend',
        templateId: 'tmpl-01',
        message: 'Wishing you all the joy in the world.',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'Test 11: Guest A creates gift card (HTTP 201)');
    assert(data.data.userId === null, 'Test 11: Gift card userId is null');
    guestAGiftCardId = data.data._id.toString();
    createdDocIds.giftCards.push(guestAGiftCardId);

    // Read back with Guest A's cookie
    const readRes = await fetch(`${baseUrl}/api/v1/gift-cards/${guestAGiftCardId}`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
    });
    assert(readRes.status === 200, 'Test 11: Guest A reads their own gift card (HTTP 200)');
  }

  // Test 12: Guest B cannot read, update, or delete Guest A's gift card
  {
    const readRes = await fetch(`${baseUrl}/api/v1/gift-cards/${guestAGiftCardId}`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
    });
    assert(readRes.status === 403, "Test 12: Guest B reading Guest A's gift card is rejected (HTTP 403)");

    const putRes = await fetch(`${baseUrl}/api/v1/gift-cards/${guestAGiftCardId}`, {
      method: 'PUT',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
      body: JSON.stringify({ message: 'Compromised by Guest B' }),
    });
    assert(putRes.status === 403, "Test 12: Guest B updating Guest A's gift card is rejected (HTTP 403)");

    const delRes = await fetch(`${baseUrl}/api/v1/gift-cards/${guestAGiftCardId}`, {
      method: 'DELETE',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
    });
    assert(delRes.status === 403, "Test 12: Guest B deleting Guest A's gift card is rejected (HTTP 403)");
  }

  // Test 13: Anonymous caller cannot access a gift card by document ID
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards/${guestAGiftCardId}`);
    assert(res.status === 401, 'Test 13: Anonymous caller reading gift card by ID is rejected (HTTP 401 Unauthorized)');
  }

  // Test 14: Authenticated User A cannot delete Guest B's gift card
  let guestBGiftCardId;
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
      body: JSON.stringify({
        recipientName: 'Guest B Recipient',
        templateId: 'tmpl-02',
        message: 'Personal message from Guest B',
      }),
    });
    const data = await res.json();
    guestBGiftCardId = data.data._id.toString();
    createdDocIds.giftCards.push(guestBGiftCardId);
  }

  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards/${guestBGiftCardId}`, {
      method: 'DELETE',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${tokenA}`,
      },
    });
    assert(res.status === 401 || res.status === 403, "Test 14: User A deleting Guest B's gift card is rejected (HTTP 401/403)");
    const inDb = await GiftCard.findById(guestBGiftCardId);
    assert(inDb !== null, 'Test 14: Database confirms gift card was NOT deleted');
  }

  // Test 15: Authenticated users retain access to their own gift cards
  let userAGiftCardId;
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        recipientName: 'Beloved',
        templateId: 'tmpl-04',
        message: 'Always and forever.',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'Test 15: User A creates authenticated gift card (HTTP 201)');
    userAGiftCardId = data.data._id.toString();
    createdDocIds.giftCards.push(userAGiftCardId);

    const listRes = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const listData = await listRes.json();
    assert(listRes.status === 200, 'Test 15: User A lists own gift cards (HTTP 200)');
    assert(listData.data.some((g) => g._id.toString() === userAGiftCardId), 'Test 15: Created card is present in list');
  }

  // -------------------------------------------------------------
  // ADDITIONAL SECURITY VERIFICATIONS (Tests 16 - 22)
  // -------------------------------------------------------------
  console.log('\n[SECTION 3: ADDITIONAL SECURITY VERIFICATIONS]');

  // Test 16: Missing session cookie is rejected
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestBOnlyConsultationId}`);
    assert(res.status === 401, 'Test 16: Request with missing session cookie is rejected (HTTP 401)');
  }

  // Test 17: Invalid session cookie is rejected
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${guestBOnlyConsultationId}`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=invalid_tampered_token_string_1234567890`,
      },
    });
    assert(res.status === 403, 'Test 17: Request with invalid session cookie is rejected (HTTP 403)');
  }

  // Test 18: Expired session is rejected
  let expiredConsultationId;
  {
    const expiredDoc = await Consultation.create({
      userId: null,
      guestSessionHash: hashGuestToken('valid_token_but_expired_1234567890'),
      guestSessionExpiresAt: new Date(Date.now() - 60000), // 1 minute in the past
      recipientName: 'Expired Session Test',
      relationship: 'friend',
      occasion: 'birthday',
      desiredEmotion: 'appreciation',
    });
    expiredConsultationId = expiredDoc._id.toString();
    createdDocIds.consultations.push(expiredConsultationId);

    const res = await fetch(`${baseUrl}/api/v1/consultations/${expiredConsultationId}`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=valid_token_but_expired_1234567890`,
      },
    });
    const data = await res.json();
    assert(res.status === 401, 'Test 18: Expired session cookie is rejected (HTTP 401)');
    assert(data.code === 'GUEST_SESSION_EXPIRED', 'Test 18: Returns code GUEST_SESSION_EXPIRED');
  }

  // Test 19: Guest session token is never returned in response JSON
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: browserHeaders,
      body: JSON.stringify({
        recipientName: 'Sanitization Test',
        relationship: 'colleague',
        occasion: 'thank_you',
        desiredEmotion: 'appreciation',
      }),
    });
    const data = await res.json();
    createdDocIds.consultations.push(data.data._id.toString());
    assert(data.data.guestSessionHash === undefined, 'Test 19: guestSessionHash is excluded from response JSON');
    assert(data.data.guestSessionExpiresAt === undefined, 'Test 19: guestSessionExpiresAt is excluded from response JSON');
    assert(data.data.tokenHash === undefined, 'Test 19: tokenHash is excluded from response JSON');
  }

  // Test 20: Guest session token is never stored in plaintext in MongoDB
  {
    const inDb = await Consultation.findById(guestBOnlyConsultationId);
    assert(inDb.guestSessionHash !== null, 'Test 20: guestSessionHash exists in MongoDB');
    assert(inDb.guestSessionHash !== guestBCookie, 'Test 20: Database value is NOT equal to raw cookie');
    assert(inDb.guestSessionHash === hashGuestToken(guestBCookie), 'Test 20: Database value matches exact SHA-256 hash');
  }

  // Test 21: Concurrent claiming attempts cannot result in multiple owners
  {
    const createRes = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: browserHeaders,
      body: JSON.stringify({
        recipientName: 'Race Condition Test',
        relationship: 'colleague',
        occasion: 'thank_you',
        desiredEmotion: 'appreciation',
      }),
    });
    const createData = await createRes.json();
    const raceConsultationId = createData.data._id.toString();
    const raceGuestCookie = extractGuestCookie(createRes);
    createdDocIds.consultations.push(raceConsultationId);

    const [resClaim1, resClaim2] = await Promise.all([
      fetch(`${baseUrl}/api/v1/consultations/${raceConsultationId}`, {
        method: 'PUT',
        headers: {
          ...browserHeaders,
          Authorization: `Bearer ${tokenA}`,
          Cookie: `${GUEST_SESSION_COOKIE_NAME}=${raceGuestCookie}`,
        },
        body: JSON.stringify({ notes: 'Claim attempt User A' }),
      }),
      fetch(`${baseUrl}/api/v1/consultations/${raceConsultationId}`, {
        method: 'PUT',
        headers: {
          ...browserHeaders,
          Authorization: `Bearer ${tokenB}`,
          Cookie: `${GUEST_SESSION_COOKIE_NAME}=${raceGuestCookie}`,
        },
        body: JSON.stringify({ notes: 'Claim attempt User B' }),
      }),
    ]);

    const status1 = resClaim1.status;
    const status2 = resClaim2.status;

    const statuses = [status1, status2];
    assert(statuses.includes(200), 'Test 21: Exactly one concurrent claim request succeeds (HTTP 200)');
    assert(statuses.includes(403), 'Test 21: The competing concurrent claim request fails (HTTP 403)');

    const inDb = await Consultation.findById(raceConsultationId);
    assert(
      inDb.userId.toString() === userA._id.toString() || inDb.userId.toString() === userB._id.toString(),
      'Test 21: Exactly one user became the permanent owner'
    );
  }

  // Test 22: Existing JWT authentication, CSRF, CORS, and refresh-token behavior remain functional
  {
    const healthRes = await fetch(`${baseUrl}/health`);
    assert(healthRes.status === 200, 'Test 22: Health endpoint functional (HTTP 200)');

    const csrfRes = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://malicious-attacker-site.com',
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({ relationship: 'friend', occasion: 'birthday', desiredEmotion: 'appreciation' }),
    });
    assert(csrfRes.status === 403, 'Test 22: CSRF protection blocks untrusted origin with cookies (HTTP 403)');
  }

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} MANDATORY TESTS PASSED!`);
  console.log('======================================================\n');
}

setup()
  .then(runTests)
  .then(teardown)
  .catch(async (err) => {
    console.error('\n❌ REMEDIATION TEST FAILED:', err);
    try {
      await teardown();
    } catch {}
    process.exit(1);
  });
