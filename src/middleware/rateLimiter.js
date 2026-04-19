/**
 * @file rateLimiter.js
 * @description Express rate-limiter middleware for the /login endpoint.
 *
 * Configuration (via env):
 *  - RATE_LIMIT_WINDOW_MS  : sliding window in milliseconds (default: 60 000 → 1 min)
 *  - RATE_LIMIT_MAX        : max requests per window per IP (default: 5)
 *
 * Returns HTTP 429 with a Retry-After header when the limit is exceeded.
 */

'use strict';

const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX } = require('../config/env');

const loginRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX,
  standardHeaders: true,   // Return RateLimit-* headers (RFC 6585)
  legacyHeaders: false,    // Disable X-RateLimit-* legacy headers

  /**
   * Key generator: use the real client IP, respecting X-Forwarded-For
   * when the app runs behind a trusted proxy (set app.set('trust proxy', 1)).
   */
  keyGenerator: (req) => req.ip,

  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      message: `Maximum ${RATE_LIMIT_MAX} login attempts per minute. Please try again later.`,
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    });
  },
});

module.exports = { loginRateLimiter };
