/**
 * @file errorHandler.js
 * @description Global Express error-handling middleware.
 * Catches all errors forwarded via next(err) and returns a consistent JSON shape.
 *
 * Error shape:
 * {
 *   "error": "<short error type>",
 *   "message": "<human-readable description>",
 *   "fields": { ... }   // optional, present on validation errors
 * }
 */

'use strict';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Validation errors raised by our validators (see validators/auth.js)
  if (err.type === 'VALIDATION_ERROR') {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Input validation failed.',
      fields: err.fields,
    });
  }

  // JWT-specific errors
  if (err.name === 'JsonWebTokenError' || err.name === 'NotBeforeError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Token has expired.',
    });
  }

  // Generic server error — never leak internals in production
  const isDev = process.env.NODE_ENV !== 'production';
  console.error('[error]', err);

  return res.status(err.status ?? 500).json({
    error: 'Internal Server Error',
    message: isDev ? err.message : 'An unexpected error occurred.',
  });
};

module.exports = { errorHandler };
