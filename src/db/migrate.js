/**
 * One-shot migration script — run with: npm run migrate
 * Creates the wellness_profiles table if it does not already exist.
 */
require('dotenv').config();
const pool = require('./pool');

const SQL = `
  CREATE TABLE IF NOT EXISTS wellness_profiles (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       VARCHAR(255)  NOT NULL,
    current_weight  NUMERIC(6,2)  NOT NULL CHECK (current_weight > 0),
    target_weight   NUMERIC(6,2)  NOT NULL CHECK (target_weight > 0),
    step_target     INTEGER       NOT NULL CHECK (step_target > 0),
    active_minutes  INTEGER       NOT NULL CHECK (active_minutes > 0),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
  );

  -- Partial unique index: one profile per user (upsert key)
  CREATE UNIQUE INDEX IF NOT EXISTS idx_wellness_profiles_user_id
    ON wellness_profiles (user_id);
`;

async function migrate() {
  console.log('[migrate] Running wellness_profiles migration...');
  try {
    await pool.query(SQL);
    console.log('[migrate] Done.');
  } catch (err) {
    console.error('[migrate] Failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
