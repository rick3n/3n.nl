/**
 * @file tokenService.js
 * @description Centralises all JWT creation and verification logic.
 *
 * Token strategy:
 *  - Access token  : short-lived (15m), HS256-signed JWT, returned in response body.
 *  - Refresh token : long-lived (7d), HS256-signed JWT, stored in httpOnly cookie.
 *
 * Both tokens are signed with JWT_SECRET (HS256).
 * To upgrade to RS256, swap `JWT_SECRET` for a PEM private key in `sign()`
 * and the corresponding public key in `verify()`.
 */

'use strict';

const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
  JWT_ACCESS_EXPIRY,
  JWT_REFRESH_EXPIRY,
  JWT_ALGORITHM,
} = require('../config/env');

/** Standard JWT sign options */
const BASE_SIGN_OPTIONS = { algorithm: JWT_ALGORITHM };

/**
 * Generates a signed access token for the given user.
 *
 * @param {{ id: string, email: string }} user
 * @returns {string} Signed JWT access token
 */
const generateAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      type: 'access',
    },
    JWT_SECRET,
    { ...BASE_SIGN_OPTIONS, expiresIn: JWT_ACCESS_EXPIRY }
  );

/**
 * Generates a signed refresh token for the given user.
 * Payload is intentionally minimal — only the subject is needed to re-issue.
 *
 * @param {{ id: string }} user
 * @returns {string} Signed JWT refresh token
 */
const generateRefreshToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      type: 'refresh',
    },
    JWT_SECRET,
    { ...BASE_SIGN_OPTIONS, expiresIn: JWT_REFRESH_EXPIRY }
  );

/**
 * Verifies and decodes a JWT token.
 *
 * @param {string} token
 * @returns {object} Decoded payload
 * @throws {JsonWebTokenError | TokenExpiredError} on invalid / expired token
 */
const verifyToken = (token) => jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });

/**
 * Parses the refresh token expiry string (e.g. '7d') into milliseconds
 * so it can be passed directly to cookie maxAge.
 *
 * Supports: s (seconds), m (minutes), h (hours), d (days).
 *
 * @returns {number} milliseconds
 */
const refreshTokenMaxAgeMs = () => {
  const expiry = JWT_REFRESH_EXPIRY;
  const unit = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1), 10);
  const multipliers = { s: 1_000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * (multipliers[unit] ?? 1_000);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  refreshTokenMaxAgeMs,
};
