/**
 * Pure business logic for wellness profile.
 * No I/O — receives data, returns computed result.
 * I/O is handled by the repository layer.
 */

/**
 * Calculates derived daily wellness statistics from saved goals.
 * @param {{ currentWeight: number, targetWeight: number, stepTarget: number, activeMinutes: number }} profile
 * @returns {{ weightDeltaKg: number, estimatedDailyCalorieBurn: number, weeklyStepGoal: number }}
 */
function computeWellnessStats(profile) {
  const weightDeltaKg = Number(
    (profile.currentWeight - profile.targetWeight).toFixed(2)
  );

  // MET-based estimate: active_minutes * 5 kcal/min (moderate intensity)
  const estimatedDailyCalorieBurn = profile.activeMinutes * 5;

  const weeklyStepGoal = profile.stepTarget * 7;

  return { weightDeltaKg, estimatedDailyCalorieBurn, weeklyStepGoal };
}

module.exports = { computeWellnessStats };
