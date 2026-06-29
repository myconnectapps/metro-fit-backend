/**
 * Data access layer for wellness profiles.
 * Abstracts all PostgreSQL I/O behind a clean interface.
 */
const pool = require('../../db/pool');

/**
 * Upserts a wellness profile for the given user.
 * @param {string} userId
 * @param {{ currentWeight: number, targetWeight: number, stepTarget: number, activeMinutes: number }} data
 * @returns {Promise<object>} saved row
 */
async function upsertWellnessProfile(userId, data) {
  const { currentWeight, targetWeight, stepTarget, activeMinutes } = data;

  const result = await pool.query(
    `INSERT INTO wellness_profiles
       (user_id, current_weight, target_weight, step_target, active_minutes)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET
       current_weight = EXCLUDED.current_weight,
       target_weight  = EXCLUDED.target_weight,
       step_target    = EXCLUDED.step_target,
       active_minutes = EXCLUDED.active_minutes,
       updated_at     = NOW()
     RETURNING *`,
    [userId, currentWeight, targetWeight, stepTarget, activeMinutes]
  );

  return result.rows[0];
}

/**
 * Retrieves the wellness profile for a given user.
 * @param {string} userId
 * @returns {Promise<object|null>}
 */
async function findWellnessProfile(userId) {
  const result = await pool.query(
    'SELECT * FROM wellness_profiles WHERE user_id = $1',
    [userId]
  );
  return result.rows[0] || null;
}

module.exports = { upsertWellnessProfile, findWellnessProfile };
