const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const productRoutes = require('./routes/productRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const giftCardRoutes = require('./routes/giftCardRoutes');

const app = express();

// Security middleware
app.use(helmet());

// Dynamic CORS configuration allowing localhost, Vercel deployments, and CLIENT_ORIGIN
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      callback(null, true); // Permissive in dev/MVP to avoid blocking deployments
    },
    credentials: true,
  })
);

app.use(express.json());

// Health Check Endpoint (Vital for Render zero-downtime health probes)
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'charis-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    service: 'CHARIS Master API',
    version: '1.0.0',
    documentation: '/api/v1',
    status: 'operational',
  });
});

// REST API Contract v1
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/consultations', consultationRoutes);
app.use('/api/v1/gift-cards', giftCardRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on CHARIS API`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[CHARIS Server Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
