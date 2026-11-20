const User = require('../models/User');
const { verifyAccessToken } = require('../utils/tokenUtils');

/**
 * Authentication Middleware
 *
 * Verifies the JWT access token from either:
 *  1. HTTP-only cookie (`charis_access_token`)
 *  2. Authorization header (`Bearer <token>`)
 *
 * Enforces:
 *  - Cryptographic signature & expiration via HS256
 *  - Active account verification (rejects deleted / non-existent users)
 *  - Dynamic role binding from DB to prevent stale claims
 *
 * Attaches verified user payload `req.user = { id, email, role }` on success.
 */
async function auth(req, res, next) {
  let token = null;

  // 1. Check cookies first (preferred for browser SPA)
  if (req.cookies && req.cookies.charis_access_token) {
    token = req.cookies.charis_access_token;
  }
  // 2. Check Authorization Bearer header (for mobile / API clients)
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.substring(7).trim();
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. No access token provided.',
      code: 'AUTH_REQUIRED',
    });
  }

  try {
    const decoded = verifyAccessToken(token);

    // Live account check: ensures deleted/disabled users cannot use valid tokens
    const user = await User.findById(decoded.sub).select('_id email role');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists',
        code: 'USER_NOT_FOUND',
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
    };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed access token',
      code: 'INVALID_TOKEN',
    });
  }
}

/**
 * Optional Role-based authorization middleware
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions',
        code: 'FORBIDDEN',
      });
    }
    next();
  };
}

/**
 * Optional Authentication Middleware
 *
 * If a valid token is provided (cookie or Bearer header), sets req.user.
 * If no token is provided, sets req.user = null and continues cleanly (guest flow).
 * If a token is provided but is expired, invalid, or belongs to a non-existent user,
 * rejects with 401 (prevents spoofing or silent fallback on forged/corrupted tokens).
 */
async function optionalAuth(req, res, next) {
  let token = null;

  if (req.cookies && req.cookies.charis_access_token) {
    token = req.cookies.charis_access_token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.substring(7).trim();
  }

  // No credentials provided -> legitimate guest request
  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub).select('_id email role');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists',
        code: 'USER_NOT_FOUND',
      });
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
    };
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid or malformed access token',
      code: 'INVALID_TOKEN',
    });
  }
}

module.exports = {
  auth,
  optionalAuth,
  requireRole,
};
