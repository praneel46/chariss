require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Initialize Database connection asynchronously
connectDB();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`  CHARIS Backend Server is running!`);
  console.log(`  Port: ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Health Check: http://localhost:${PORT}/health`);
  console.log(`  API Base: http://localhost:${PORT}/api/v1`);
  console.log(`===============================================`);
});
