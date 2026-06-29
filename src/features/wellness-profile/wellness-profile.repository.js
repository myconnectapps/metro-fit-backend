/**
 * Data access layer for wellness profiles.
 * Abstracts all I/O behind a clean interface.
 * Uses local JSON file storage to avoid PostgreSQL dependency.
 */
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../../db/data.json');

// Helper to read data from JSON file
async function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return {};
    }
    const content = await fs.promises.readFile(DATA_FILE, 'utf8');
    return JSON.parse(content || '{}');
  } catch (err) {
    console.error('[DB] Error reading JSON store', err);
    return {};
  }
}

// Helper to write data to JSON file
async function writeData(data) {
  try {
    await fs.promises.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[DB] Error writing to JSON store', err);
  }
}

/**
 * Upserts a wellness profile for the given user.
 * @param {string} userId
 * @param {{ currentWeight: number, targetWeight: number, stepTarget: number, activeMinutes: number }} data
 * @returns {Promise<object>} saved row
 */
async function upsertWellnessProfile(userId, data) {
  const { currentWeight, targetWeight, stepTarget, activeMinutes } = data;
  const store = await readData();

  const now = new Date().toISOString();
  const existing = store[userId] || {};

  const record = {
    id: existing.id || uuidv4(),
    user_id: userId,
    current_weight: currentWeight,
    target_weight: targetWeight,
    step_target: stepTarget,
    active_minutes: activeMinutes,
    created_at: existing.created_at || now,
    updated_at: now,
  };

  store[userId] = record;
  await writeData(store);

  return record;
}

/**
 * Retrieves the wellness profile for a given user.
 * @param {string} userId
 * @returns {Promise<object|null>}
 */
async function findWellnessProfile(userId) {
  const store = await readData();
  return store[userId] || null;
}

module.exports = { upsertWellnessProfile, findWellnessProfile };

