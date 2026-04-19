/**
 * @file env.js
 * @description Centralised environment variable loader with validation.
 * Fails fast at startup if required variables are missing.
 */

'use strict';

const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const optional = (name, defaultValue) => process.env[name] ?? defaultValue;

module.exports = {
  // Server
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '3000'), 10),

  // Database
  DATABASE_URL: required('DATABASE_URL'),

  // JWT
  JWT_SECRET: required('JWT_SECRET'),
  JWT_ACCESS_EXPIRY: optional('JWT_ACCESS_EXPIRY', '15m'),
  JWT_REFRESH_EXPIRY: optional('JWT_REFRESH_EXPIRY', '7d'),
  JWT_ALGORITHM: optional('JWT_ALGORITHM', 'HS256'),

  // Cookie
  COOKIE_SECURE: optional('NODE_ENV', 'development') === 'production',
  COOKIE_DOMAIN: optional('COOKIE_DOMAIN', ''),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(optional('RATE_LIMIT_WINDOW_MS', '60000'), 10), // 1 minute
  RATE_LIMIT_MAX: parseInt(optional('RATE_LIMIT_MAX', '5'), 10),                 // 5 attempts
};
