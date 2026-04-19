/**
 * @file userService.js
 * @description Data-access layer for the `users` table.
 * Keeps SQL out of controllers and makes the service independently testable
 * by accepting an optional db client (useful for transaction injection in tests).
 */

'use strict';

const pool = require('../db/pool');

/**
 * Finds a single active user by email address.
 * Returns `null` when no matching active user exists.
 *
 * @param {string} email - Normalised (lowercased, trimmed) email address.
 * @param {import('pg').PoolClient} [db] - Optional pg client (for DI in tests).
 * @returns {Promise<{
 *   id: string,
 *   email: string,
 *   password_hash: string,
 *   is_active: boolean,
 *   last_login: Date | null
 * } | null>}
 */
const findActiveUserByEmail = async (email, db = pool) => {
  const { rows } = await db.query(
    `SELECT id, email, password_hash, is_active, last_login
       FROM users
      WHERE email = $1
        AND is_active = TRUE
      LIMIT 1`,
    [email]
  );
  return rows[0] ?? null;
};

/**
 * Updates the `last_login` timestamp for a user to the current UTC time.
 * Fire-and-forget is acceptable; a failure here must not break the login flow.
 *
 * @param {string} userId - UUID of the user.
 * @param {import('pg').PoolClient} [db]
 * @returns {Promise<void>}
 */
const updateLastLogin = async (userId, db = pool) => {
  await db.query(
    `UPDATE users SET last_login = NOW() WHERE id = $1`,
    [userId]
  );
};

module.exports = { findActiveUserByEmail, updateLastLogin };
