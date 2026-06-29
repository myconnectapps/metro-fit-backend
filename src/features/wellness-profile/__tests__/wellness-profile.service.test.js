/**
 * Unit tests for wellness profile service (pure business logic).
 */
const { computeWellnessStats } = require('../wellness-profile.service');

describe('computeWellnessStats', () => {
  test('computes correct weight delta', () => {
    const stats = computeWellnessStats({
      currentWeight: 80,
      targetWeight: 70,
      stepTarget: 10000,
      activeMinutes: 30,
    });
    expect(stats.weightDeltaKg).toBe(10);
  });

  test('computes estimated calorie burn at 5 kcal/min', () => {
    const stats = computeWellnessStats({
      currentWeight: 80,
      targetWeight: 70,
      stepTarget: 10000,
      activeMinutes: 30,
    });
    expect(stats.estimatedDailyCalorieBurn).toBe(150);
  });

  test('computes weekly step goal as 7x daily target', () => {
    const stats = computeWellnessStats({
      currentWeight: 80,
      targetWeight: 70,
      stepTarget: 10000,
      activeMinutes: 30,
    });
    expect(stats.weeklyStepGoal).toBe(70000);
  });

  test('handles when target weight is higher than current weight', () => {
    const stats = computeWellnessStats({
      currentWeight: 60,
      targetWeight: 70,
      stepTarget: 8000,
      activeMinutes: 45,
    });
    expect(stats.weightDeltaKg).toBe(-10);
  });
});
