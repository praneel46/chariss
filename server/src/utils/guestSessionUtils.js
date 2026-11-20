const crypto = require('crypto');
const config = require('../config/env');

const GUEST_SESSION_COOKIE_NAME = 'charis_guest_session';
const GUEST_SESSION_EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Generates a cryptographically strong 256-bit random hex token.
 */
function generateGuestToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Computes the SHA-256 hash of a raw token.
 * Only this hash is stored in the database.
 */
function hashGuestToken(token) {
  if (!token || typeof token !== 'string') return '';
  return crypto.createHash('sha256').update(token.trim()).digest('hex');
}

/**
 * Extracts the raw guest session token from cookies or optional authorization header.
 */
function getGuestTokenFromRequest(req) {
  if (req.cookies && req.cookies[GUEST_SESSION_COOKIE_NAME]) {
    return req.cookies[GUEST_SESSION_COOKIE_NAME];
  }
  // Optional fallback for API/mobile clients
  if (req.headers && req.headers['x-guest-session-token']) {
    return req.headers['x-guest-session-token'];
  }
  return null;
}

/**
 * Sets the HTTP-only, secure guest session cookie on the response.
 */
function setGuestSessionCookie(res, token) {
  res.cookie(GUEST_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: GUEST_SESSION_EXPIRY_MS,
  });
}

/**
 * Clears the guest session cookie on the response.
 */
function clearGuestSessionCookie(res) {
  if (!res || typeof res.clearCookie !== 'function') return;
  res.clearCookie(GUEST_SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    path: '/',
  });
}

/**
 * Reuses an existing valid guest session token from the request or generates a new one.
 * Delivers the cookie on the response and returns the SHA-256 hash and expiration date.
 */
function getOrCreateGuestSession(req, res) {
  const existingToken = getGuestTokenFromRequest(req);
  let rawToken = existingToken;

  if (!rawToken || rawToken.length < 32) {
    rawToken = generateGuestToken();
    setGuestSessionCookie(res, rawToken);
  }

  const tokenHash = hashGuestToken(rawToken);
  const expiresAt = new Date(Date.now() + GUEST_SESSION_EXPIRY_MS);

  return {
    rawToken,
    tokenHash,
    expiresAt,
  };
}

/**
 * Verifies whether the incoming request is authorized to access a guest-owned record.
 * Defensively handles either (record, req) or (req, record) invocation signatures.
 * Returns { allowed: true, tokenHash } if authorized, or { allowed: false, status, code, message }.
 */
function verifyGuestRecordOwnership(arg1, arg2) {
  // Disambiguate record and request arguments defensively
  const record = (arg1 && (arg1.guestSessionHash || arg1._id || arg1.id)) ? arg1 : arg2;
  const req = (arg1 && (arg1.cookies || arg1.headers)) ? arg1 : arg2;

  if (!record || typeof record !== 'object') {
    return {
      allowed: false,
      status: 400,
      code: 'INVALID_RECORD',
      message: 'Invalid consultation or resource record',
    };
  }

  // 1. Guard against legacy or corrupted records lacking a valid hash
  if (!record.guestSessionHash) {
    return {
      allowed: false,
      status: 403,
      code: 'GUEST_SESSION_INVALID',
      message: 'Access denied: Legacy or unverified guest record',
    };
  }

  // 2. Check expiration
  if (record.guestSessionExpiresAt && new Date(record.guestSessionExpiresAt) < new Date()) {
    return {
      allowed: false,
      status: 401,
      code: 'GUEST_SESSION_EXPIRED',
      message: 'Guest session expired. Please start a new consultation session.',
    };
  }

  // 3. Extract token from request
  const presentedToken = getGuestTokenFromRequest(req);
  if (!presentedToken) {
    return {
      allowed: false,
      status: 401,
      code: 'GUEST_SESSION_REQUIRED',
      message: 'Guest session cookie required to access this record',
    };
  }

  // 4. Constant-time comparison of SHA-256 hashes
  const presentedHash = hashGuestToken(presentedToken);
  const hashesMatch =
    presentedHash.length === record.guestSessionHash.length &&
    crypto.timingSafeEqual(
      Buffer.from(presentedHash, 'utf8'),
      Buffer.from(record.guestSessionHash, 'utf8')
    );

  if (!hashesMatch) {
    return {
      allowed: false,
      status: 403,
      code: 'FORBIDDEN',
      message: 'Access denied: You do not own this guest record',
    };
  }

  return {
    allowed: true,
    tokenHash: presentedHash,
  };
}

module.exports = {
  GUEST_SESSION_COOKIE_NAME,
  GUEST_SESSION_EXPIRY_MS,
  generateGuestToken,
  hashGuestToken,
  getGuestTokenFromRequest,
  setGuestSessionCookie,
  clearGuestSessionCookie,
  getOrCreateGuestSession,
  verifyGuestRecordOwnership,
};
