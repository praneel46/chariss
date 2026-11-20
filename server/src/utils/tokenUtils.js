const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Parses a duration string (e.g. '15m', '7d', '24h', '30s') into milliseconds.
 * Defaults to 15 minutes if format is unrecognized.
 *
 * @param {string|number} duration
 * @returns {number} duration in milliseconds
 */
function parseDurationToMs(duration) {
  if (typeof duration === 'number') return duration;
  const match = /^(\d+)([smhd])$/.exec(String(duration).trim());
  if (!match) return 15 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  switch (unit) {
    case 's':
      return value * 1000;
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return 15 * 60 * 1000;
  }
}

/**
 * Signs a new JWT access token with minimal user claims.
 *
 * @param {Object} user - User document or user object
 * @returns {string} signed JWT access token
 */
function generateAccessToken(user) {
  const userId = user._id ? user._id.toString() : user.id;
  const payload = {
    sub: userId,
    email: user.email,
    role: user.role || 'user',
    type: 'access',
  };

  return jwt.sign(payload, config.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: config.jwtAccessExpiry,
  });
}

/**
 * Verifies a JWT access token and ensures it is an 'access' type token.
 * Strictly enforces HS256 algorithm to prevent algorithm confusion attacks.
 *
 * @param {string} token
 * @returns {Object} decoded token payload
 * @throws {Error} if token signature is invalid, expired, or wrong type
 */
function verifyAccessToken(token) {
  const decoded = jwt.verify(token, config.jwtSecret, {
    algorithms: ['HS256'],
  });
  if (decoded.type !== 'access') {
    const error = new Error('Invalid token type');
    error.name = 'JsonWebTokenError';
    throw error;
  }
  return decoded;
}

/**
 * Hashes a raw refresh token using SHA-256 for secure storage in MongoDB.
 *
 * @param {string} rawToken
 * @returns {string} hexadecimal SHA-256 hash
 */
function hashToken(rawToken) {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

/**
 * Generates a cryptographically random refresh token and its SHA-256 hash.
 *
 * @returns {{ rawToken: string, tokenHash: string }}
 */
function generateRefreshToken() {
  const rawToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = hashToken(rawToken);
  return { rawToken, tokenHash };
}

/**
 * Calculates the expiration Date for a refresh token session based on config.
 *
 * @returns {Date}
 */
function getRefreshTokenExpiryDate() {
  const ms = parseDurationToMs(config.jwtRefreshExpiry);
  return new Date(Date.now() + ms);
}

/**
 * Cookie options for the access token cookie.
 */
function getAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: parseDurationToMs(config.jwtAccessExpiry),
  };
}

/**
 * Cookie options for clearing the access token cookie.
 */
function clearAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    path: '/',
  };
}

/**
 * Cookie options for the refresh token cookie.
 * Restricted to the auth endpoint path for defense-in-depth.
 */
function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    path: '/api/v1/auth',
    maxAge: parseDurationToMs(config.jwtRefreshExpiry),
  };
}

/**
 * Cookie options for clearing the refresh token cookie.
 */
function clearRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    path: '/api/v1/auth',
  };
}

module.exports = {
  parseDurationToMs,
  generateAccessToken,
  verifyAccessToken,
  hashToken,
  generateRefreshToken,
  getRefreshTokenExpiryDate,
  getAccessCookieOptions,
  clearAccessCookieOptions,
  getRefreshCookieOptions,
  clearRefreshCookieOptions,
};
