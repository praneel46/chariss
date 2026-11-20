const dns = require('dns');
if (typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    dns.setDefaultResultOrder('ipv4first');
  } catch (e) {}
}

const mongoose = require('mongoose');
const config = require('./env');

/**
 * Sanitizes MongoDB URIs to prevent credential leakage in logs
 */
const sanitizeMongoUri = (uri) => {
  if (!uri || typeof uri !== 'string') return '';
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
};

let listenersRegistered = false;
let reconnectTimer = null;
let isReconnecting = false;

/**
 * Schedules non-overlapping background reconnection attempts
 */
const scheduleReconnect = (delayMs = 15000) => {
  if (
    process.env.NODE_ENV === 'test' ||
    reconnectTimer ||
    mongoose.connection.readyState === 1 ||
    mongoose.connection.readyState === 2
  ) {
    return;
  }

  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    if (mongoose.connection.readyState === 0 && !isReconnecting) {
      isReconnecting = true;
      try {
        await connectDB();
      } catch (err) {
        // Next attempt will be scheduled if still disconnected
      } finally {
        isReconnecting = false;
      }
    }
  }, delayMs);

  if (reconnectTimer && typeof reconnectTimer.unref === 'function') {
    reconnectTimer.unref();
  }
};

const registerConnectionListeners = () => {
  if (listenersRegistered) return;
  listenersRegistered = true;

  mongoose.connection.on('connected', () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    console.log('[CHARIS Database] MongoDB connection established successfully.');
  });

  mongoose.connection.on('error', (err) => {
    console.error('[CHARIS Database] MongoDB runtime error:', err.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('[CHARIS Database] MongoDB disconnected.');
    scheduleReconnect(10000);
  });
};

/**
 * Connects to persistent MongoDB instance using Mongoose.
 * Throws on failure; never silently falls back to in-memory/mock storage.
 */
const connectDB = async () => {
  // Return existing active connection if already established
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If connection is in progress, await resolution
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve, reject) => {
      mongoose.connection.once('connected', resolve);
      mongoose.connection.once('error', reject);
    });
    return mongoose.connection;
  }

  const uri = config.mongodbUri;
  const sanitized = sanitizeMongoUri(uri);

  registerConnectionListeners();

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      bufferTimeoutMS: 2500,
    });
    console.log(`[CHARIS Database] Connected to: ${sanitized}`);
    return conn;
  } catch (error) {
    console.error('\n======================================================');
    console.error('❌ [CHARIS Database Error] Failed to connect to MongoDB');
    console.error(`Target: ${sanitized}`);
    console.error(`Reason: ${error.message}`);
    console.error('CHARIS requires an active MongoDB database. Fallback storage is disabled.');
    console.error('======================================================\n');
    scheduleReconnect(15000);
    throw error;
  }
};

const disconnectDB = async () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[CHARIS Database] Disconnected cleanly.');
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  sanitizeMongoUri,
  scheduleReconnect,
};
