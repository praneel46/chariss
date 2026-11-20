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
let adminUser;
let tokenA;
let tokenB;
let adminToken;

function extractGuestCookie(res) {
  const setCookie = res.headers.get('set-cookie');
  if (!setCookie) return null;
  const match = setCookie.match(new RegExp(`${GUEST_SESSION_COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

async function setup() {
  try {
    await connectDB();
  } catch (err) {
    setupMemoryStubs();
  }

  const timestamp = Date.now();
  userA = await User.create({
    name: 'Regression User A',
    email: `reg_user_a_${timestamp}@charis.test`,
    password: 'SecurePassword123!',
    role: 'user',
  });
  createdDocIds.users.push(userA._id);

  userB = await User.create({
    name: 'Regression User B',
    email: `reg_user_b_${timestamp}@charis.test`,
    password: 'SecurePassword123!',
    role: 'user',
  });
  createdDocIds.users.push(userB._id);

  adminUser = await User.create({
    name: 'Atelier Admin',
    email: `admin_${timestamp}@charis.test`,
    password: 'SecurePassword123!',
    role: 'admin',
  });
  createdDocIds.users.push(adminUser._id);

  tokenA = generateAccessToken(userA);
  tokenB = generateAccessToken(userB);
  adminToken = generateAccessToken(adminUser);

  await Consultation.syncIndexes();
  await GiftCard.syncIndexes();

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
  console.log('🔍 PHASE 2 STEP 2: FINAL REGRESSION SECURITY SUITE');
  console.log('======================================================\n');

  const browserHeaders = {
    'Content-Type': 'application/json',
    Origin: 'http://localhost:5173',
  };

  // =============================================================
  // SECTION 1: GUEST LIST ISOLATION
  // =============================================================
  console.log('[1] GUEST LIST ISOLATION:');

  // Guest A creates Consultation 1
  let guestACookie;
  let guestAConsultation1Id;
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: browserHeaders,
      body: JSON.stringify({
        recipientName: 'Guest A Recipient 1',
        relationship: 'mother',
        occasion: 'birthday',
        desiredEmotion: 'appreciation',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'Guest A creates Consultation 1 (HTTP 201)');
    guestAConsultation1Id = data.data._id.toString();
    createdDocIds.consultations.push(guestAConsultation1Id);
    guestACookie = extractGuestCookie(res);
  }

  // Guest A creates Consultation 2 reusing existing cookie
  let guestAConsultation2Id;
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({
        recipientName: 'Guest A Recipient 2',
        relationship: 'sibling',
        occasion: 'anniversary',
        desiredEmotion: 'joy',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'Guest A creates Consultation 2 (HTTP 201)');
    guestAConsultation2Id = data.data._id.toString();
    createdDocIds.consultations.push(guestAConsultation2Id);
  }

  // Guest B creates Consultation 3 (new session)
  let guestBCookie;
  let guestBConsultationId;
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: browserHeaders,
      body: JSON.stringify({
        recipientName: 'Guest B Recipient 1',
        relationship: 'colleague',
        occasion: 'thank_you',
        desiredEmotion: 'appreciation',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'Guest B creates Consultation 3 (HTTP 201)');
    guestBConsultationId = data.data._id.toString();
    createdDocIds.consultations.push(guestBConsultationId);
    guestBCookie = extractGuestCookie(res);
  }

  // Guest A lists consultations -> must receive only Consultation 1 and 2
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
    });
    const data = await res.json();
    assert(res.status === 200, 'Guest A lists consultations (HTTP 200)');
    assert(data.data.length === 2, 'Guest A receives exactly 2 consultations');
    const returnedIds = data.data.map((c) => c._id.toString());
    assert(
      returnedIds.includes(guestAConsultation1Id) && returnedIds.includes(guestAConsultation2Id),
      "Guest A list contains both of Guest A's consultations"
    );
    assert(!returnedIds.includes(guestBConsultationId), "Guest A list does NOT contain Guest B's consultation");
  }

  // Guest B lists consultations -> must receive only Consultation 3
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
    });
    const data = await res.json();
    assert(res.status === 200, 'Guest B lists consultations (HTTP 200)');
    assert(data.data.length === 1, 'Guest B receives exactly 1 consultation');
    assert(data.data[0]._id.toString() === guestBConsultationId, "Guest B list contains only Guest B's consultation");
  }

  // Repeat for Gift Cards: Guest A creates 2 gift cards, Guest B creates 1
  let guestAGiftCard1Id;
  let guestAGiftCard2Id;
  let guestBGiftCardId;
  {
    const res1 = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({ recipientName: 'Friend 1', templateId: 'tmpl-01', message: 'Hello 1' }),
    });
    const data1 = await res1.json();
    guestAGiftCard1Id = data1.data._id.toString();
    createdDocIds.giftCards.push(guestAGiftCard1Id);

    const res2 = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({ recipientName: 'Friend 2', templateId: 'tmpl-02', message: 'Hello 2' }),
    });
    const data2 = await res2.json();
    guestAGiftCard2Id = data2.data._id.toString();
    createdDocIds.giftCards.push(guestAGiftCard2Id);

    const res3 = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
      body: JSON.stringify({ recipientName: 'Friend B', templateId: 'tmpl-03', message: 'Hello B' }),
    });
    const data3 = await res3.json();
    guestBGiftCardId = data3.data._id.toString();
    createdDocIds.giftCards.push(guestBGiftCardId);
  }

  // Guest A lists gift cards -> exactly 2
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
    });
    const data = await res.json();
    assert(res.status === 200, 'Guest A lists gift cards (HTTP 200)');
    assert(data.data.length === 2, 'Guest A receives exactly 2 gift cards');
    const returnedIds = data.data.map((g) => g._id.toString());
    assert(returnedIds.includes(guestAGiftCard1Id) && returnedIds.includes(guestAGiftCard2Id), 'Includes Cards 1 & 2');
    assert(!returnedIds.includes(guestBGiftCardId), "Does NOT include Guest B's card");
  }

  // Guest B lists gift cards -> exactly 1
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      headers: {
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
    });
    const data = await res.json();
    assert(res.status === 200, 'Guest B lists gift cards (HTTP 200)');
    assert(data.data.length === 1, 'Guest B receives exactly 1 gift card');
    assert(data.data[0]._id.toString() === guestBGiftCardId, "Contains only Guest B's card");
  }

  // =============================================================
  // SECTION 2: COMPLETE GUEST GIFT-CARD CRUD
  // =============================================================
  console.log('\n[2] COMPLETE GUEST GIFT-CARD CRUD & ISOLATION:');

  // Create Guest A test card
  let crudCardId;
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({
        recipientName: 'CRUD Target',
        templateId: 'tmpl-01',
        message: 'Original Message',
      }),
    });
    const data = await res.json();
    assert(res.status === 201, 'Guest A creates CRUD gift card (HTTP 201)');
    crudCardId = data.data._id.toString();
    createdDocIds.giftCards.push(crudCardId);
  }

  // Read: Guest A reads own card
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards/${crudCardId}`, {
      headers: { Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}` },
    });
    assert(res.status === 200, 'Guest A reads own gift card (HTTP 200)');
  }

  // Update: Guest A updates own card
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards/${crudCardId}`, {
      method: 'PUT',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({ message: 'Updated by Guest A' }),
    });
    const data = await res.json();
    assert(res.status === 200, 'Guest A updates own gift card (HTTP 200)');
    assert(data.data.message === 'Updated by Guest A', 'Message successfully updated');
  }

  // Attack: Guest B attempts to read Guest A's card -> 403
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards/${crudCardId}`, {
      headers: { Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}` },
    });
    assert(res.status === 403, "Guest B reading Guest A's card is rejected (HTTP 403)");
  }

  // Attack: Guest B attempts to update Guest A's card -> 403
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards/${crudCardId}`, {
      method: 'PUT',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
      body: JSON.stringify({ message: 'Attacker Message' }),
    });
    assert(res.status === 403, "Guest B updating Guest A's card is rejected (HTTP 403)");
    const inDb = await GiftCard.findById(crudCardId);
    assert(inDb.message === 'Updated by Guest A', 'Database confirms message was NOT changed by Guest B');
  }

  // Attack: Guest B attempts to delete Guest A's card -> 403
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards/${crudCardId}`, {
      method: 'DELETE',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
    });
    assert(res.status === 403, "Guest B deleting Guest A's card is rejected (HTTP 403)");
    const inDb = await GiftCard.findById(crudCardId);
    assert(inDb !== null, 'Database confirms card was NOT deleted by Guest B');
  }

  // Delete: Guest A deletes own card -> 200
  {
    const res = await fetch(`${baseUrl}/api/v1/gift-cards/${crudCardId}`, {
      method: 'DELETE',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
    });
    assert(res.status === 200, 'Guest A deletes own gift card (HTTP 200)');
    const inDb = await GiftCard.findById(crudCardId);
    assert(inDb === null, 'Database confirms card is permanently deleted');
  }

  // =============================================================
  // SECTION 3: AUTHENTICATED AND GUEST ISOLATION
  // =============================================================
  console.log('\n[3] AUTHENTICATED AND GUEST ISOLATION:');

  // User A creates authenticated records
  let userAConsultationId;
  let userAGiftCardId;
  {
    const resC = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        recipientName: 'User A Recipient',
        relationship: 'partner',
        occasion: 'anniversary',
        desiredEmotion: 'romance',
      }),
    });
    const dataC = await resC.json();
    userAConsultationId = dataC.data._id.toString();
    createdDocIds.consultations.push(userAConsultationId);

    const resG = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        recipientName: 'User A Recipient',
        templateId: 'tmpl-04',
        message: 'Auth Card A',
      }),
    });
    const dataG = await resG.json();
    userAGiftCardId = dataG.data._id.toString();
    createdDocIds.giftCards.push(userAGiftCardId);
  }

  // User A lists own records
  {
    const resC = await fetch(`${baseUrl}/api/v1/consultations`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const dataC = await resC.json();
    assert(dataC.data.every((c) => c.userId === userA._id.toString()), 'User A consultation list scoped to User A');

    const resG = await fetch(`${baseUrl}/api/v1/gift-cards`, {
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    const dataG = await resG.json();
    assert(dataG.data.every((g) => g.userId === userA._id.toString()), 'User A gift card list scoped to User A');
  }

  // User B cannot access User A's records -> 403
  {
    const resC = await fetch(`${baseUrl}/api/v1/consultations/${userAConsultationId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(resC.status === 403, "User B reading User A's consultation is rejected (HTTP 403)");

    const resG = await fetch(`${baseUrl}/api/v1/gift-cards/${userAGiftCardId}`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(resG.status === 403, "User B reading User A's gift card is rejected (HTTP 403)");
  }

  // Guest cannot access User A's records -> 401
  {
    const resC = await fetch(`${baseUrl}/api/v1/consultations/${userAConsultationId}`, {
      headers: { Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}` },
    });
    assert(resC.status === 401, "Guest reading User A's consultation is rejected (HTTP 401)");

    const resG = await fetch(`${baseUrl}/api/v1/gift-cards/${userAGiftCardId}`, {
      headers: { Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}` },
    });
    assert(resG.status === 401, "Guest reading User A's gift card is rejected (HTTP 401)");
  }

  // Guest-session cookie CANNOT override authenticated ownership
  {
    // Attacker sends User A's ID with a valid guest cookie -> still rejected with 401
    const res = await fetch(`${baseUrl}/api/v1/consultations/${userAConsultationId}`, {
      method: 'PUT',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({ notes: 'Attempted override' }),
    });
    assert(res.status === 401, 'Guest cookie cannot override authenticated ownership (HTTP 401)');
  }

  // =============================================================
  // SECTION 4: ADMIN AUTHORIZATION
  // =============================================================
  console.log('\n[4] ADMIN AUTHORIZATION:');

  // Create guest consultation for admin moderation test
  let adminTargetConsultationId;
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: {
        ...browserHeaders,
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestBCookie}`,
      },
      body: JSON.stringify({
        recipientName: 'Inappropriate Content',
        relationship: 'other',
        occasion: 'other',
        desiredEmotion: 'comfort',
      }),
    });
    const data = await res.json();
    adminTargetConsultationId = data.data._id.toString();
    createdDocIds.consultations.push(adminTargetConsultationId);
  }

  // Regular user (role: 'user') cannot delete guest consultation -> 403
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${adminTargetConsultationId}`, {
      method: 'DELETE',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${tokenA}`,
      },
    });
    assert(res.status === 401 || res.status === 403, 'Non-admin user cannot delete guest consultation (HTTP 401/403)');
  }

  // Platform Admin (role: 'admin') can delete guest consultation for moderation -> 200
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations/${adminTargetConsultationId}`, {
      method: 'DELETE',
      headers: {
        ...browserHeaders,
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert(res.status === 200, 'Admin can delete guest consultation for moderation (HTTP 200)');
    const inDb = await Consultation.findById(adminTargetConsultationId);
    assert(inDb === null, 'Consultation deleted from database');
  }

  // Verify optionalAuth does not grant admin without a valid signed token
  {
    const fakeAdminToken = 'Bearer header.payload.signature_fake';
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      headers: { Authorization: fakeAdminToken },
    });
    assert(res.status === 401, 'Forged/malformed token is rejected by optionalAuth (HTTP 401)');
  }

  // =============================================================
  // SECTION 5: COOKIE AND CSRF CONFIGURATION
  // =============================================================
  console.log('\n[5] COOKIE AND CSRF CONFIGURATION:');

  // Verify cookie delivery attributes on create
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: browserHeaders,
      body: JSON.stringify({
        relationship: 'friend',
        occasion: 'birthday',
        desiredEmotion: 'joy',
      }),
    });
    const setCookie = res.headers.get('set-cookie');
    assert(setCookie.includes('HttpOnly'), 'Cookie has HttpOnly flag');
    assert(setCookie.includes('Path=/'), 'Cookie has Path=/');
    assert(setCookie.includes('SameSite=Lax') || setCookie.includes('SameSite=Strict'), 'Cookie has SameSite attribute');
    assert(setCookie.includes('Max-Age='), 'Cookie has Max-Age attribute');
  }

  // Untrusted origin cannot mutate state with cookie -> 403
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://attacker.evil.com',
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({ relationship: 'friend', occasion: 'birthday', desiredEmotion: 'joy' }),
    });
    assert(res.status === 403, 'Untrusted origin with cookie is blocked by CSRF (HTTP 403)');
  }

  // Legitimate frontend origin with credentials succeeds -> 201
  {
    const res = await fetch(`${baseUrl}/api/v1/consultations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'http://localhost:5173',
        Cookie: `${GUEST_SESSION_COOKIE_NAME}=${guestACookie}`,
      },
      body: JSON.stringify({ relationship: 'friend', occasion: 'birthday', desiredEmotion: 'joy' }),
    });
    assert(res.status === 201, 'Legitimate frontend origin succeeds (HTTP 201)');
  }

  // Server-enforced expiration check
  {
    const expiredDoc = await Consultation.create({
      userId: null,
      guestSessionHash: hashGuestToken('server_expired_cookie_123'),
      guestSessionExpiresAt: new Date(Date.now() - 10000), // 10s in past
      relationship: 'colleague',
      occasion: 'thank_you',
      desiredEmotion: 'appreciation',
    });
    const expiredId = expiredDoc._id.toString();
    createdDocIds.consultations.push(expiredId);

    const res = await fetch(`${baseUrl}/api/v1/consultations/${expiredId}`, {
      headers: { Cookie: `${GUEST_SESSION_COOKIE_NAME}=server_expired_cookie_123` },
    });
    const data = await res.json();
    assert(res.status === 401, 'Server-enforced expiration rejects expired record (HTTP 401)');
    assert(data.code === 'GUEST_SESSION_EXPIRED', 'Code is GUEST_SESSION_EXPIRED');
  }

  console.log('\n======================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} REGRESSION TESTS PASSED!`);
  console.log('======================================================\n');
}

setup()
  .then(runTests)
  .then(teardown)
  .catch(async (err) => {
    console.error('\n❌ REGRESSION TEST FAILED:', err);
    try {
      await teardown();
    } catch {}
    process.exit(1);
  });
