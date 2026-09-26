import dotenv from 'dotenv';
import path from 'path';
// Load .env from server directory, with fallback to root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fudgedb',
  JWT_SECRET: process.env.JWT_SECRET || 'fudge-artisan-secret-key-hahndorf-2026-secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@fudgeshop.local',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'FudgeAdmin2026!',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
