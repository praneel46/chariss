const crypto = require('crypto');
const mongoose = require('mongoose');
const { z } = require('zod');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const Consultation = require('../models/Consultation');
const GiftBag = require('../models/GiftBag');
const Wishlist = require('../models/Wishlist');
const {
  getGuestTokenFromRequest,
  hashGuestToken,
  clearGuestSessionCookie,
} = require('../utils/guestSessionUtils');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  getRefreshTokenExpiryDate,
  getAccessCookieOptions,
  clearAccessCookieOptions,
  getRefreshCookieOptions,
  clearRefreshCookieOptions,
} = require('../utils/tokenUtils');

// Input validation schemas using Zod
const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long').max(128),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Helper to serialize safe user data
 */
function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    avatarUrl: user.avatarUrl || null,
    createdAt: user.createdAt,
  };
}

/**
 * Links unassigned guest consultations, gift bags, and wishlists to the newly authenticated user.
 * Uses atomic MongoDB transaction when replica set/cluster sessions are available,
 * with resilient retry logic and compensation/rollback on standalone deployments.
 * Never ignores partial claiming failures or leaves records inconsistently claimed.
 */
async function linkGuestRecordsToUser(req, userId) {
  const rawGuestToken = getGuestTokenFromRequest(req);
  if (!rawGuestToken) return { claimed: false, count: 0 };
  const guestHash = hashGuestToken(rawGuestToken);
  if (!guestHash) return { claimed: false, count: 0 };

  // Guard: Verify that records for this guestSessionHash are not already claimed by a different user
  const [foreignCons, foreignBags, foreignWish] = await Promise.all([
    Consultation.countDocuments({
      guestSessionHash: guestHash,
      userId: { $nin: [null, userId] },
    }),
    GiftBag.countDocuments({
      guestSessionHash: guestHash,
      userId: { $nin: [null, userId] },
    }),
    Wishlist.countDocuments({
      guestSessionHash: guestHash,
      userId: { $nin: [null, userId] },
    }),
  ]);

  if (foreignCons > 0 || foreignBags > 0 || foreignWish > 0) {
    throw new Error('Security conflict: Guest session records are already linked to a different account.');
  }

  // Attempt transactional claim if MongoDB deployment supports replica set transactions
  let session = null;
  let useFallback = false;
  try {
    session = await mongoose.startSession();
  } catch (sessErr) {
    session = null;
    useFallback = true;
  }

  if (session && !useFallback) {
    try {
      let result;
      await session.withTransaction(async () => {
        const [consRes, bagRes, wishRes] = await Promise.all([
          Consultation.updateMany(
            { guestSessionHash: guestHash, userId: null },
            { $set: { userId } },
            { session }
          ),
          GiftBag.updateMany(
            { guestSessionHash: guestHash, userId: null },
            { $set: { userId } },
            { session }
          ),
          Wishlist.updateMany(
            { guestSessionHash: guestHash, userId: null },
            { $set: { userId } },
            { session }
          ),
        ]);

        // Verify within transaction that no records with this guestHash remain unclaimed
        const [remCons, remBags, remWish] = await Promise.all([
          Consultation.countDocuments({ guestSessionHash: guestHash, userId: null }, { session }),
          GiftBag.countDocuments({ guestSessionHash: guestHash, userId: null }, { session }),
          Wishlist.countDocuments({ guestSessionHash: guestHash, userId: null }, { session }),
        ]);

        if (remCons > 0 || remBags > 0 || remWish > 0) {
          throw new Error(`Incomplete claim within transaction: ${remCons + remBags + remWish} records remain unclaimed.`);
        }

        result = {
          claimed: true,
          consultationsCount: consRes.modifiedCount,
          bagCount: bagRes.modifiedCount,
          wishlistCount: wishRes.modifiedCount,
        };
      });
      return result;
    } catch (txErr) {
      const isTxUnsupported =
        txErr.message &&
        (txErr.message.includes('replica set') ||
          txErr.message.includes('Transaction numbers are only allowed') ||
          txErr.message.includes('Transactions are not supported'));

      if (!isTxUnsupported) {
        console.error('[CHARIS Auth] Transactional guest claiming failed:', txErr.message);
        throw new Error(`Failed to atomically claim guest session records: ${txErr.message}`);
      }
      // If replica set transactions are genuinely not supported on this host, fall back to standalone
      useFallback = true;
    } finally {
      await session.endSession();
    }
  }

  // Standalone / Non-replica-set fallback: safe recoverable process with retry and rollback
  let attempts = 3;
  let lastError = null;
  while (attempts > 0) {
    try {
      const consRes = await Consultation.updateMany(
        { guestSessionHash: guestHash, userId: null },
        { $set: { userId } }
      );
      const bagRes = await GiftBag.updateMany(
        { guestSessionHash: guestHash, userId: null },
        { $set: { userId } }
      );
      const wishRes = await Wishlist.updateMany(
        { guestSessionHash: guestHash, userId: null },
        { $set: { userId } }
      );

      // Verify no records remain unclaimed
      const [remCons, remBags, remWish] = await Promise.all([
        Consultation.countDocuments({ guestSessionHash: guestHash, userId: null }),
        GiftBag.countDocuments({ guestSessionHash: guestHash, userId: null }),
        Wishlist.countDocuments({ guestSessionHash: guestHash, userId: null }),
      ]);

      if (remCons > 0 || remBags > 0 || remWish > 0) {
        throw new Error(`Incomplete claim: ${remCons + remBags + remWish} records remain unclaimed.`);
      }

      return {
        claimed: true,
        consultationsCount: consRes.modifiedCount,
        bagCount: bagRes.modifiedCount,
        wishlistCount: wishRes.modifiedCount,
      };
    } catch (err) {
      lastError = err;
      attempts--;
      if (attempts > 0) {
        await new Promise((r) => setTimeout(r, 100));
      }
    }
  }

  // If retries failed, roll back any records that were claimed in this attempt to avoid partial state
  console.error('[CHARIS Auth] Non-transactional guest claiming failed after retries, rolling back:', lastError?.message);
  try {
    await Promise.all([
      Consultation.updateMany({ guestSessionHash: guestHash, userId }, { $set: { userId: null } }),
      GiftBag.updateMany({ guestSessionHash: guestHash, userId }, { $set: { userId: null } }),
      Wishlist.updateMany({ guestSessionHash: guestHash, userId }, { $set: { userId: null } }),
    ]);
  } catch (rollbackErr) {
    console.error('[CHARIS Auth] Rollback failed:', rollbackErr.message);
  }

  throw new Error(`Failed to claim guest session records: ${lastError?.message}`);
}

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
async function register(req, res, next) {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { name, email, password } = parseResult.data;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        code: 'EMAIL_ALREADY_EXISTS',
      });
    }

    // Create user (password is automatically hashed by User pre-save hook)
    const user = await User.create({ name, email, password });

    // Link unauthenticated guest consultations & bag items to this user BEFORE issuing tokens
    try {
      await linkGuestRecordsToUser(req, user._id);
    } catch (claimError) {
      // Clean up newly created user on guest claiming failure to prevent half-registered account
      await User.findByIdAndDelete(user._id);
      throw claimError;
    }

    // Issue tokens and session
    const family = crypto.randomUUID();
    const accessToken = generateAccessToken(user);
    const { rawToken, tokenHash } = generateRefreshToken();

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      family,
      expiresAt: getRefreshTokenExpiryDate(),
      userAgent: req.headers['user-agent'] || null,
      ipAddress: req.ip || req.connection?.remoteAddress || null,
    });

    // Set secure HTTP-only cookies
    res.cookie('charis_access_token', accessToken, getAccessCookieOptions());
    res.cookie('charis_refresh_token', rawToken, getRefreshCookieOptions());
    clearGuestSessionCookie(res);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: sanitizeUser(user),
      accessToken,
      refreshToken: rawToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Authenticate existing user
 * POST /api/v1/auth/login
 */
async function login(req, res, next) {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { email, password } = parseResult.data;

    // Fetch user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Verify password with bcrypt
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS',
      });
    }

    // Link unauthenticated guest consultations & bag items to this user BEFORE issuing new session tokens
    await linkGuestRecordsToUser(req, user._id);

    // Issue tokens and session
    const family = crypto.randomUUID();
    const accessToken = generateAccessToken(user);
    const { rawToken, tokenHash } = generateRefreshToken();

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      family,
      expiresAt: getRefreshTokenExpiryDate(),
      userAgent: req.headers['user-agent'] || null,
      ipAddress: req.ip || req.connection?.remoteAddress || null,
    });

    // Set secure HTTP-only cookies
    res.cookie('charis_access_token', accessToken, getAccessCookieOptions());
    res.cookie('charis_refresh_token', rawToken, getRefreshCookieOptions());
    clearGuestSessionCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: sanitizeUser(user),
      accessToken,
      refreshToken: rawToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Rotate refresh token and issue new access token
 * POST /api/v1/auth/refresh
 */
async function refresh(req, res, next) {
  try {
    const rawToken = req.cookies?.charis_refresh_token || req.body?.refreshToken;

    if (!rawToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token required',
        code: 'REFRESH_TOKEN_REQUIRED',
      });
    }

    const tokenHash = hashToken(rawToken);

    // Concurrency-safe atomic rotation:
    // Atomically find unrevoked token and mark it revoked.
    // If two concurrent requests arrive with the exact same valid token, only ONE can succeed.
    const existingTokenDoc = await RefreshToken.findOneAndUpdate(
      { tokenHash, isRevoked: false },
      { isRevoked: true },
      { new: false }
    );

    if (!existingTokenDoc) {
      // Either token doesn't exist OR was already revoked (potential replay attack!)
      const revokedOrUnknown = await RefreshToken.findOne({ tokenHash });

      if (!revokedOrUnknown) {
        return res.status(401).json({
          success: false,
          message: 'Invalid refresh token',
          code: 'INVALID_REFRESH_TOKEN',
        });
      }

      // TOKEN REUSE DETECTION:
      // If a revoked token is presented, someone may have compromised a previously used token.
      // Invalidate the entire token family immediately to protect the account!
      if (revokedOrUnknown.isRevoked) {
        await RefreshToken.updateMany(
          { family: revokedOrUnknown.family },
          { isRevoked: true }
        );

        res.clearCookie('charis_access_token', clearAccessCookieOptions());
        res.clearCookie('charis_refresh_token', clearRefreshCookieOptions());

        return res.status(401).json({
          success: false,
          message: 'Token reuse detected. All sessions in this family have been terminated. Please log in again.',
          code: 'TOKEN_REUSE_DETECTED',
        });
      }
    }

    // Check token expiration
    if (existingTokenDoc.expiresAt < new Date()) {
      res.clearCookie('charis_access_token', clearAccessCookieOptions());
      res.clearCookie('charis_refresh_token', clearRefreshCookieOptions());

      return res.status(401).json({
        success: false,
        message: 'Refresh token has expired. Please log in again.',
        code: 'REFRESH_TOKEN_EXPIRED',
      });
    }

    // Find the associated user
    const user = await User.findById(existingTokenDoc.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account no longer exists',
        code: 'USER_NOT_FOUND',
      });
    }

    // ROTATION:
    // 1. Generate new refresh token
    const { rawToken: newRawToken, tokenHash: newTokenHash } = generateRefreshToken();

    // 2. Track replacement on the old document
    await RefreshToken.updateOne(
      { _id: existingTokenDoc._id },
      { replacedByTokenHash: newTokenHash }
    );

    // 3. Insert new token document into the SAME lineage family
    await RefreshToken.create({
      userId: user._id,
      tokenHash: newTokenHash,
      family: existingTokenDoc.family,
      expiresAt: getRefreshTokenExpiryDate(),
      userAgent: req.headers['user-agent'] || null,
      ipAddress: req.ip || req.connection?.remoteAddress || null,
    });

    // 4. Issue new access token
    const newAccessToken = generateAccessToken(user);

    // 5. Update cookies
    res.cookie('charis_access_token', newAccessToken, getAccessCookieOptions());
    res.cookie('charis_refresh_token', newRawToken, getRefreshCookieOptions());

    return res.status(200).json({
      success: true,
      message: 'Tokens rotated successfully',
      accessToken: newAccessToken,
      refreshToken: newRawToken,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Log out and invalidate the current refresh token session
 * POST /api/v1/auth/logout
 */
async function logout(req, res, next) {
  try {
    const rawToken = req.cookies?.charis_refresh_token || req.body?.refreshToken;

    if (rawToken) {
      const tokenHash = hashToken(rawToken);
      await RefreshToken.updateOne({ tokenHash }, { isRevoked: true });
    }

    res.clearCookie('charis_access_token', clearAccessCookieOptions());
    res.clearCookie('charis_access_token', { ...clearAccessCookieOptions(), path: '/api/v1' });
    res.clearCookie('charis_refresh_token', clearRefreshCookieOptions());
    res.clearCookie('charis_refresh_token', { ...clearRefreshCookieOptions(), path: '/' });
    res.clearCookie('charis_refresh_token', { ...clearRefreshCookieOptions(), path: '/api/v1' });
    clearGuestSessionCookie(res);

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Return current authenticated user profile
 * GET /api/v1/auth/me
 */
async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
        code: 'USER_NOT_FOUND',
      });
    }

    return res.status(200).json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
};
