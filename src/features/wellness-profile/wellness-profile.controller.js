/**
 * HTTP controller for wellness profile endpoints.
 * Responsibility: parse request → validate → delegate → format response.
 */
const { validateWellnessProfile } = require('./wellness-profile.validation');
const { computeWellnessStats } = require('./wellness-profile.service');
const repository = require('./wellness-profile.repository');

/**
 * POST /api/wellness-profile
 * Saves a user's wellness profile and returns computed stats.
 */
async function saveWellnessProfile(req, res) {
  const correlationId = req.headers['x-correlation-id'] || require('uuid').v4();
  const operation = 'save_wellness_profile';

  console.info('[wellness-profile] Operation start', {
    correlationId,
    operation,
    body: req.body,
  });

  const start = Date.now();

  try {
    // 1. Validate input — fail fast with clear errors
    const { valid, errors } = validateWellnessProfile(req.body);
    if (!valid) {
      console.warn('[wellness-profile] Validation failed', { correlationId, errors });
      return res.status(400).json({ success: false, errors });
    }

    const { currentWeight, targetWeight, stepTarget, activeMinutes } = req.body;

    // 2. Fetch dependencies — user_id from body (no auth yet, per spec)
    const userId = req.body.userId || 'anonymous';

    // 3. Pure logic — compute stats
    const stats = computeWellnessStats({
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      stepTarget: Number(stepTarget),
      activeMinutes: Number(activeMinutes),
    });

    // 4. Persist result
    const saved = await repository.upsertWellnessProfile(userId, {
      currentWeight: Number(currentWeight),
      targetWeight: Number(targetWeight),
      stepTarget: Number(stepTarget),
      activeMinutes: Number(activeMinutes),
    });

    const duration = Date.now() - start;
    console.info('[wellness-profile] Operation success', {
      correlationId,
      operation,
      duration,
      profileId: saved.id,
    });

    return res.status(201).json({
      success: true,
      data: {
        profile: saved,
        stats,
      },
    });
  } catch (err) {
    const duration = Date.now() - start;
    console.error('[wellness-profile] Operation failure', {
      correlationId,
      operation,
      duration,
      error: err.message,
      stack: err.stack,
    });
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    });
  }
}

/**
 * GET /api/wellness-profile/:userId
 * Retrieves the wellness profile for a user.
 */
async function getWellnessProfile(req, res) {
  const correlationId = req.headers['x-correlation-id'] || require('uuid').v4();
  const operation = 'get_wellness_profile';
  const start = Date.now();

  console.info('[wellness-profile] Operation start', {
    correlationId,
    operation,
    userId: req.params.userId,
  });

  try {
    const profile = await repository.findWellnessProfile(req.params.userId);

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    const stats = computeWellnessStats({
      currentWeight: Number(profile.current_weight),
      targetWeight: Number(profile.target_weight),
      stepTarget: profile.step_target,
      activeMinutes: profile.active_minutes,
    });

    const duration = Date.now() - start;
    console.info('[wellness-profile] Operation success', {
      correlationId, operation, duration,
    });

    return res.status(200).json({ success: true, data: { profile, stats } });
  } catch (err) {
    const duration = Date.now() - start;
    console.error('[wellness-profile] Operation failure', {
      correlationId, operation, duration, error: err.message,
    });
    return res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
}

module.exports = { saveWellnessProfile, getWellnessProfile };
