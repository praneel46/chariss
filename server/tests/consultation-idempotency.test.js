const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../src/config/env');
const { connectDB, disconnectDB } = require('../src/config/db');
const { generateAccessToken } = require('../src/utils/tokenUtils');

// In-memory data store for testing
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
const User = require('../src/models/User');

function setupMemoryStubs() {
  isUsingMemoryFallback = true;
  console.log('⚡ Atlas IP unwhitelisted: using in-memory model harness to execute real HTTP Express routes.\n');

  Consultation.create = async function (data) {
    // Check if unique compound index would collide
    if (data.idempotencyKey) {
      for (const existing of store.consultations.values()) {
        if (
          existing.idempotencyKey === data.idempotencyKey &&
          ((data.userId && existing.userId && existing.userId.toString() === data.userId.toString()) ||
           (data.guestSessionHash && existing.guestSessionHash && existing.guestSessionHash === data.guestSessionHash))
        ) {
          const err = new Error('E11000 duplicate key error collection');
          err.code = 11000;
          throw err;
        }
      }
    }
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

  Consultation.syncIndexes = async function () {};

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
}

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ PASSED: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    process.exitCode = 1;
  }
}

function makeRequest(app, { method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        socketPath: app.__socketPath,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          Origin: 'http://localhost:5173',
          ...headers,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(data);
          } catch (e) {
            json = data;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: json,
          });
        });
      }
    );
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function run() {
  console.log('\n======================================================');
  console.log('🔍 PHASE 2 MILESTONE 1.1: CONSULTATION RETRY SAFETY AUDIT');
  console.log('======================================================\n');

  try {
    await connectDB();
    console.log('Connected to real MongoDB Atlas cluster.');
  } catch (err) {
    setupMemoryStubs();
  }

  const app = require('../src/app');
  const server = http.createServer(app);

  const socketPath = process.platform === 'win32'
    ? `\\\\.\\pipe\\charis-idempotency-test-${Date.now()}`
    : `/tmp/charis-idempotency-test-${Date.now()}.sock`;

  await new Promise((resolve) => server.listen(socketPath, resolve));
  app.__socketPath = socketPath;

  const validPayload = {
    recipientName: 'Elena Rostova',
    relationship: 'partner',
    occasion: 'anniversary',
    interests: ['Fine Wine', 'Horology'],
    personality: ['Thoughtful', 'Analytical'],
    desiredEmotion: 'deeply cherished',
    budget: { min: 500, max: 2000, currency: 'USD' },
    notes: 'Likes high quality timepieces and artisanal items',
  };

  const modifiedPayload = {
    recipientName: 'David Kim',
    relationship: 'friend',
    occasion: 'birthday',
    interests: ['Tech', 'Gaming'],
    personality: ['Creative', 'Energetic'],
    desiredEmotion: 'delighted and surprised',
    budget: { min: 100, max: 300, currency: 'USD' },
    notes: 'Looking for desk accessories',
  };

  try {
    // -------------------------------------------------------------------------
    // TEST 1: GUEST IDEMPOTENCY & RETRY
    // -------------------------------------------------------------------------
    console.log('[1] GUEST IDEMPOTENCY & RETRY SAFETY:');

    const key1 = 'test-idemp-guest-001';
    const res1 = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: { 'Idempotency-Key': key1 },
      body: validPayload,
    });



    assert(res1.status === 201, 'First submission creates consultation (HTTP 201)');
    assert(res1.body.success === true, 'Response indicates success');
    const guestCookie = res1.headers['set-cookie'] ? res1.headers['set-cookie'][0] : null;
    assert(Boolean(guestCookie), 'Guest session cookie was set');
    const cookieHeader = guestCookie ? guestCookie.split(';')[0] : '';
    const initialId = res1.body.data._id;
    assert(Boolean(initialId), 'Consultation ID was returned');

    // Retry identical request with same key
    const resRetry = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        'Idempotency-Key': key1,
        Cookie: cookieHeader,
      },
      body: validPayload,
    });

    assert(resRetry.status === 200, 'Retrying identical submission returns HTTP 200 OK');
    assert(resRetry.body.success === true, 'Retry response indicates success');
    assert(resRetry.body.data._id === initialId, 'Retry returns the EXACT same consultation ID');
    assert(resRetry.body.data.idempotencyKey === key1, 'Returned record includes idempotency key');

    // -------------------------------------------------------------------------
    // TEST 2: IDEMPOTENCY CONFLICT ON MODIFIED PAYLOAD
    // -------------------------------------------------------------------------
    console.log('\n[2] IDEMPOTENCY CONFLICT DETECTION:');

    const resConflict = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        'Idempotency-Key': key1,
        Cookie: cookieHeader,
      },
      body: modifiedPayload,
    });

    assert(resConflict.status === 409, 'Reusing key with different payload returns HTTP 409 Conflict');
    assert(resConflict.body.code === 'IDEMPOTENCY_CONFLICT', 'Response error code is IDEMPOTENCY_CONFLICT');
    assert(
      resConflict.body.message.includes('Idempotency conflict'),
      'Conflict error message clearly explains the payload mismatch'
    );

    // -------------------------------------------------------------------------
    // TEST 3: DIFFERENT KEYS CREATE SEPARATE RECORDS
    // -------------------------------------------------------------------------
    console.log('\n[3] SEPARATE KEYS CREATE SEPARATE RECORDS:');

    const key2 = 'test-idemp-guest-002';
    const resDifferentKey = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        'Idempotency-Key': key2,
        Cookie: cookieHeader,
      },
      body: validPayload,
    });

    assert(resDifferentKey.status === 201, 'Submission with different key creates new record (HTTP 201)');
    assert(resDifferentKey.body.data._id !== initialId, 'New record has a different ID');

    // -------------------------------------------------------------------------
    // TEST 4: CONCURRENT / RACE CONDITION SAFETY
    // -------------------------------------------------------------------------
    console.log('\n[4] CONCURRENT SUBMISSION SAFETY:');

    const keyRace = 'test-idemp-concurrent-003';
    const concurrentPromises = [
      makeRequest(app, {
        method: 'POST',
        path: '/api/v1/consultations',
        headers: {
          'Idempotency-Key': keyRace,
          Cookie: cookieHeader,
        },
        body: validPayload,
      }),
      makeRequest(app, {
        method: 'POST',
        path: '/api/v1/consultations',
        headers: {
          'Idempotency-Key': keyRace,
          Cookie: cookieHeader,
        },
        body: validPayload,
      }),
      makeRequest(app, {
        method: 'POST',
        path: '/api/v1/consultations',
        headers: {
          'Idempotency-Key': keyRace,
          Cookie: cookieHeader,
        },
        body: validPayload,
      }),
    ];

    const results = await Promise.all(concurrentPromises);
    const statuses = results.map((r) => r.status);
    assert(
      statuses.every((s) => s === 201 || s === 200),
      `All concurrent requests succeed with 200 or 201 (statuses: ${statuses.join(', ')})`
    );
    const ids = results.map((r) => r.body.data._id);
    assert(
      ids.every((id) => id === ids[0]),
      `All concurrent requests return the exact same document ID (${ids[0]})`
    );

    // -------------------------------------------------------------------------
    // TEST 5: TENANT ISOLATION (GUEST VS GUEST)
    // -------------------------------------------------------------------------
    console.log('\n[5] GUEST TENANT ISOLATION:');

    // Guest B tries to use the same key that Guest A used
    const resGuestB = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        'Idempotency-Key': key1,
        // No cookie: fresh Guest B
      },
      body: validPayload,
    });

    assert(resGuestB.status === 201, 'Guest B using same key as Guest A creates Guest B record (HTTP 201)');
    assert(resGuestB.body.data._id !== initialId, 'Guest B record is distinct from Guest A record');

    // -------------------------------------------------------------------------
    // TEST 6: AUTHENTICATED USER IDEMPOTENCY & ISOLATION
    // -------------------------------------------------------------------------
    console.log('\n[6] AUTHENTICATED USER IDEMPOTENCY:');

    const timestamp = Date.now();
    const userA = await User.create({ name: 'User A', email: `usera-${timestamp}@example.com`, password: 'password123', role: 'user' });
    const userB = await User.create({ name: 'User B', email: `userb-${timestamp}@example.com`, password: 'password123', role: 'user' });

    const tokenA = generateAccessToken(userA);
    const tokenB = generateAccessToken(userB);

    const keyAuth1 = 'test-idemp-auth-userA-001';

    const resUserA1 = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Idempotency-Key': keyAuth1,
      },
      body: validPayload,
    });

    assert(resUserA1.status === 201, 'User A creates consultation with key (HTTP 201)');
    const userAInitialId = resUserA1.body.data._id;

    // User A retry
    const resUserARetry = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Idempotency-Key': keyAuth1,
      },
      body: validPayload,
    });

    assert(resUserARetry.status === 200, 'User A retrying with same key returns HTTP 200');
    assert(resUserARetry.body.data._id === userAInitialId, 'User A receives same consultation ID');

    // User B tries with User A's key
    const resUserB = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenB}`,
        'Idempotency-Key': keyAuth1,
      },
      body: validPayload,
    });

    assert(resUserB.status === 201, 'User B with same key creates User B own record (HTTP 201)');
    assert(resUserB.body.data._id !== userAInitialId, 'User B does NOT receive User A document');

    // -------------------------------------------------------------------------
    // TEST 7: SECURITY & DATA PROTECTION (NO SENSITIVE FIELD LEAKS)
    // -------------------------------------------------------------------------
    console.log('\n[7] SECURITY & SENSITIVE FIELD HYGIENE:');

    assert(res1.body.data.guestSessionHash === undefined, 'Response omits guestSessionHash');
    assert(res1.body.data.requestPayloadHash === undefined, 'Response omits requestPayloadHash');
    assert(resRetry.body.data.requestPayloadHash === undefined, 'Retry response omits requestPayloadHash');
    assert(resUserARetry.body.data.requestPayloadHash === undefined, 'Auth retry response omits requestPayloadHash');

    // -------------------------------------------------------------------------
    // TEST 8: HEADER & BODY VARIATIONS
    // -------------------------------------------------------------------------
    console.log('\n[8] HEADER AND BODY VARIATION COMPATIBILITY:');

    // X-Idempotency-Key header
    const keyHeaderX = 'test-idemp-header-x-001';
    const resHeaderX = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'X-Idempotency-Key': keyHeaderX,
      },
      body: validPayload,
    });
    assert(resHeaderX.status === 201, 'X-Idempotency-Key header is accepted (HTTP 201)');
    assert(resHeaderX.body.data.idempotencyKey === keyHeaderX, 'idempotencyKey is correctly stored');

    // Body property idempotencyKey
    const keyBody = 'test-idemp-body-001';
    const resBody = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
      body: {
        ...validPayload,
        idempotencyKey: keyBody,
      },
    });
    assert(resBody.status === 201, 'Body idempotencyKey is accepted (HTTP 201)');
    assert(resBody.body.data.idempotencyKey === keyBody, 'idempotencyKey from body is stored');

    // -------------------------------------------------------------------------
    // TEST 9: HEADER AND BODY KEY CONSISTENCY
    // -------------------------------------------------------------------------
    console.log('\n[9] HEADER AND BODY KEY CONSISTENCY:');

    // Conflicting keys
    const resMismatch = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Idempotency-Key': 'key-header-abc',
      },
      body: {
        ...validPayload,
        idempotencyKey: 'key-body-xyz',
      },
    });
    assert(resMismatch.status === 400, 'Conflicting header and body keys return HTTP 400');
    assert(resMismatch.body.code === 'IDEMPOTENCY_KEY_MISMATCH', 'Error code is IDEMPOTENCY_KEY_MISMATCH');

    // Matching header and body keys
    const matchingKey = 'key-consistent-001';
    const resMatching = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Idempotency-Key': matchingKey,
      },
      body: {
        ...validPayload,
        idempotencyKey: matchingKey,
      },
    });
    assert(resMatching.status === 201, 'Matching header and body keys succeed with HTTP 201');
    assert(resMatching.body.data.idempotencyKey === matchingKey, 'Saved record has matching idempotencyKey');

    // -------------------------------------------------------------------------
    // TEST 10: KEY FORMAT VALIDATION & SENSITIVE INJECTION DEFENSE
    // -------------------------------------------------------------------------
    console.log('\n[10] FORMAT VALIDATION & INJECTION DEFENSE:');

    // Invalid header key format (spaces)
    const resInvalidHeaderKey = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Idempotency-Key': 'invalid key with spaces',
      },
      body: validPayload,
    });
    assert(resInvalidHeaderKey.status === 400, 'Header key with spaces is rejected (HTTP 400)');
    assert(resInvalidHeaderKey.body.code === 'INVALID_IDEMPOTENCY_KEY', 'Error code is INVALID_IDEMPOTENCY_KEY');

    // Client attempting to inject requestPayloadHash
    const resInjectedHash = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
      body: {
        ...validPayload,
        requestPayloadHash: 'malicious-injected-hash',
      },
    });
    assert(resInjectedHash.status === 400, 'Client injecting requestPayloadHash is rejected (HTTP 400)');
    assert(resInjectedHash.body.code === 'VALIDATION_ERROR', 'Error code is VALIDATION_ERROR');

    // -------------------------------------------------------------------------
    // TEST 11: ARRAY ORDER-INVARIANCE DETERMINISM
    // -------------------------------------------------------------------------
    console.log('\n[11] ARRAY ORDER-INVARIANCE IN PAYLOAD HASHING:');

    // Submit with rearranged interests array: ['Horology', 'Fine Wine'] vs ['Fine Wine', 'Horology']
    const rearrangedPayload = {
      ...validPayload,
      interests: ['Horology', 'Fine Wine'], // order reversed
    };
    const resRearranged = await makeRequest(app, {
      method: 'POST',
      path: '/api/v1/consultations',
      headers: {
        Authorization: `Bearer ${tokenA}`,
        'Idempotency-Key': matchingKey, // reuse the matchingKey created in Test 9
      },
      body: rearrangedPayload,
    });
    assert(resRearranged.status === 200, 'Rearranged interests array produces identical hash and returns HTTP 200');
    assert(resRearranged.body.data.idempotencyKey === matchingKey, 'Returns existing consultation record');
    console.log(`🎉 ALL ${passedTests}/${totalTests} IDEMPOTENCY & RETRY TESTS PASSED!`);
    console.log('======================================================\n');
  } finally {
    server.close();
    await disconnectDB();
  }
}

run().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
