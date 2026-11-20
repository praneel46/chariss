const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

// 1. Explicitly load environment variables from server/.env first, then cwd fallback
const serverEnvPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: serverEnvPath });
dotenv.config();

// 2. Define strict schema using Zod
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET is required and must be at least 16 characters for security'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL string').default('http://localhost:5173'),
  CLIENT_ORIGIN: z.string().optional(),
  LLM_API_KEY: z.string().optional(),
});

// 3. Validate process.env at application startup
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n======================================================');
  console.error('❌ [CHARIS Configuration Error] Invalid Environment Variables');
  console.error('======================================================');
  parsed.error.issues.forEach((issue) => {
    console.error(`  • ${issue.path.join('.') || 'configuration'}: ${issue.message}`);
  });
  console.error('------------------------------------------------------');
  console.error('Please configure the required variables in server/.env');
  console.error('Refer to server/.env.example for required keys and formats.');
  console.error('======================================================\n');
  process.exit(1);
}

// 4. Centralized frozen configuration object
const config = Object.freeze({
  port: parsed.data.PORT,
  nodeEnv: parsed.data.NODE_ENV,
  isProduction: parsed.data.NODE_ENV === 'production',
  isDevelopment: parsed.data.NODE_ENV === 'development',
  isTest: parsed.data.NODE_ENV === 'test',
  mongodbUri: parsed.data.MONGODB_URI,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtAccessExpiry: parsed.data.JWT_ACCESS_EXPIRY,
  jwtRefreshExpiry: parsed.data.JWT_REFRESH_EXPIRY,
  clientUrl: parsed.data.CLIENT_URL,
  clientOrigin: parsed.data.CLIENT_ORIGIN || parsed.data.CLIENT_URL,
  llmApiKey: parsed.data.LLM_API_KEY || '',
  // Direct uppercase aliases matching environment variable names
  PORT: parsed.data.PORT,
  NODE_ENV: parsed.data.NODE_ENV,
  MONGODB_URI: parsed.data.MONGODB_URI,
  JWT_SECRET: parsed.data.JWT_SECRET,
  JWT_ACCESS_EXPIRY: parsed.data.JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY: parsed.data.JWT_REFRESH_EXPIRY,
  CLIENT_URL: parsed.data.CLIENT_URL,
});

module.exports = config;
