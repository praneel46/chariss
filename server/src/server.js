const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
dns.setDefaultResultOrder('ipv4first');

const config = require('./config/env');
const app = require('./app');
const { connectDB } = require('./config/db');

const startServer = async () => {
  // Start HTTP listener
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`  CHARIS Backend Server is running!`);
    console.log(`  Port: ${config.port}`);
    console.log(`  Environment: ${config.nodeEnv}`);
    console.log(`  Health Check: http://localhost:${config.port}/health`);
    console.log(`  Database Health: http://localhost:${config.port}/api/v1/health/db`);
    console.log(`  API Base: http://localhost:${config.port}/api/v1`);
    console.log(`===============================================`);
  });

  // Attempt database connection
  try {
    await connectDB();
  } catch (error) {
    console.warn('⚠️ [CHARIS Warning] MongoDB Atlas connection pending. Ensure current IP is whitelisted on Atlas.');
  }
};

startServer();
