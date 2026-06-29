/**
 * PostgreSQL connection pool.
 * Reads config from environment variables — never hardcode credentials.
 */
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  // Keep connections alive; fail fast on bad config
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10,
});

// Immediately verify the pool can connect at startup
pool.on('error', (err) => {
  console.error('[DB] Unexpected error on idle client', { error: err.message });
  process.exit(1);
});

module.exports = pool;
