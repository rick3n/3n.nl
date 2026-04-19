/**
 * @file pool.js
 * @description PostgreSQL connection pool (pg).
 * Single pool instance shared across the application to avoid connection exhaustion.
 */

'use strict';

const { Pool } = require('pg');
const { DATABASE_URL } = require('../config/env');

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected client error:', err.message);
});

module.exports = pool;
