const config = require('../config/env');

/**
 * CSRF Protection Middleware & Origin Validation
 *
 * Protects cookie-authenticated state-changing requests (POST, PUT, PATCH, DELETE)
 * by verifying the Origin or Referer header against strictly allowed application origins.
 *
 * Safe methods (GET, HEAD, OPTIONS) are exempt.
 * Direct non-cookie API requests (e.g., Bearer auth or server-to-server) pass through.
 */
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  config.clientUrl,
  config.clientOrigin,
].filter(Boolean);

/**
 * Validates whether a request origin is strictly trusted.
 * Rejects loose substring matches (e.g., attacker-localhost.com or evil.vercel.app).
 *
 * @param {string} originStr
 * @returns {boolean}
 */
function isAllowedOrigin(originStr) {
  if (!originStr || typeof originStr !== 'string') return false;

  // 1. Direct match with configured origins
  if (allowedOrigins.includes(originStr)) return true;

  // 2. Strict URL parsing
  try {
    const parsed = new URL(originStr);

    // In development or test mode, permit any port on legitimate localhost or 127.0.0.1
    if (!config.isProduction) {
      if (
        (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') &&
        (parsed.protocol === 'http:' || parsed.protocol === 'https:')
      ) {
        return true;
      }
    }
  } catch {
    return false;
  }

  return false;
}

function csrfProtection(req, res, next) {
  // 1. Safe methods don't mutate state
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // 2. Check if cookies are attached to the request
  const hasAuthCookies = Boolean(
    req.cookies &&
      (req.cookies.charis_access_token ||
        req.cookies.charis_refresh_token ||
        req.cookies.charis_guest_session)
  );

  // 3. Extract request origin
  const origin = req.headers.origin;
  const referer = req.headers.referer;

  let requestOrigin = origin;
  if (!requestOrigin && referer) {
    try {
      const parsedUrl = new URL(referer);
      requestOrigin = parsedUrl.origin;
    } catch {
      requestOrigin = null;
    }
  }

  // 4. If request has authentication cookies, Origin verification is strictly required
  if (hasAuthCookies) {
    if (!requestOrigin) {
      return res.status(403).json({
        success: false,
        message: 'Cross-origin request blocked: Missing Origin header for cookie-authenticated request',
        code: 'CSRF_ORIGIN_MISSING',
      });
    }

    if (!isAllowedOrigin(requestOrigin)) {
      return res.status(403).json({
        success: false,
        message: 'Cross-origin request blocked: Untrusted Origin',
        code: 'CSRF_UNTRUSTED_ORIGIN',
      });
    }
  }

  next();
}

module.exports = {
  csrfProtection,
  isAllowedOrigin,
  allowedOrigins,
};
