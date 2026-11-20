const express = require('express');
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

const router = express.Router();

/**
 * GET /api/v1/health/db
 * Returns real-time database connection status based on Mongoose connection state.
 * Returns HTTP 200 if connected (readyState === 1)
 * Returns HTTP 503 if disconnected, connecting, or unavailable
 */
router.get('/db', async (req, res) => {
  let readyState = mongoose.connection.readyState;

  // If currently disconnected and not in test environment, attempt on-demand connection verification
  if (readyState === 0 && process.env.NODE_ENV !== 'test') {
    try {
      await connectDB();
      readyState = mongoose.connection.readyState;
    } catch (err) {
      readyState = mongoose.connection.readyState;
    }
  }

  const isConnected = readyState === 1;

  const stateLabels = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const responseData = {
    status: isConnected ? 'healthy' : 'unhealthy',
    database: {
      connected: isConnected,
      state: stateLabels[readyState] || 'unknown',
      readyState,
    },
    timestamp: new Date().toISOString(),
  };

  if (!isConnected) {
    return res.status(503).json(responseData);
  }

  return res.status(200).json(responseData);
});

module.exports = router;
