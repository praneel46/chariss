const bcrypt = require('bcryptjs');
const { z } = require('zod');

// Salt rounds factor: strictly 12 as required
const SALT_ROUNDS = 12;

// Password validation schema using Zod
const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters');

/**
 * Validates a plaintext password string against security requirements
 * @param {string} password
 * @returns {{ valid: boolean, error?: string }}
 */
const validatePassword = (password) => {
  const result = passwordSchema.safeParse(password);
  if (!result.success) {
    return {
      valid: false,
      error: result.error.issues[0]?.message || 'Invalid password',
    };
  }
  return { valid: true };
};

/**
 * Utility helper to inspect whether a string matches standard bcrypt hash formatting.
 * NOTE: Never use this function to decide whether user-supplied input should skip hashing!
 * User-supplied passwords must ALWAYS be hashed regardless of their content or prefix.
 * @param {string} str
 * @returns {boolean}
 */
const isHashed = (str) => {
  if (typeof str !== 'string') return false;
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(str);
};

/**
 * Hashes a plaintext password using bcrypt with salt rounds of 12.
 * Plaintext passwords are ALWAYS validated and hashed unconditionally.
 * Never bypasses hashing based on string prefix or format.
 * Never logs passwords or hashes.
 * @param {string} password - The plaintext password to hash
 * @returns {Promise<string>} - The resulting bcrypt hash
 */
const hashPassword = async (password) => {
  const validation = validatePassword(password);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

/**
 * Compares a candidate plaintext password with a stored bcrypt hash.
 * Never logs passwords or hashes.
 * @param {string} plainPassword - Plaintext password input
 * @param {string} hashedPassword - Stored bcrypt hash
 * @returns {Promise<boolean>} - True if matching, false otherwise
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    return false;
  }
  if (typeof plainPassword !== 'string' || typeof hashedPassword !== 'string') {
    return false;
  }
  return bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  SALT_ROUNDS,
  validatePassword,
  isHashed,
  hashPassword,
  comparePassword,
};
