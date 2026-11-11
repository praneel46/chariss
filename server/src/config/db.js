const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('[CHARIS Server] Warning: MONGODB_URI is not set. Database operations will use in-memory curated catalogue fallback.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[CHARIS Server] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[CHARIS Server] MongoDB Connection Error: ${error.message}`);
    console.warn('[CHARIS Server] Continuing with fallback in-memory dataset.');
  }
};

module.exports = connectDB;
