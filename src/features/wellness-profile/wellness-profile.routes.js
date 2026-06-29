/**
 * Routes for the wellness-profile feature.
 * Mounted at /api/wellness-profile in app.js.
 */
const { Router } = require('express');
const { saveWellnessProfile, getWellnessProfile } = require('./wellness-profile.controller');

const router = Router();

// POST /api/wellness-profile — create or update a wellness profile
router.post('/', saveWellnessProfile);

// GET /api/wellness-profile/:userId — retrieve a wellness profile
router.get('/:userId', getWellnessProfile);

module.exports = router;
