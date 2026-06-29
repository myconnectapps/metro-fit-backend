/**
 * Unit tests for wellness profile validation.
 * No I/O — pure function tests.
 */
const {
  isPositiveNumber,
  validateWellnessProfile,
} = require('../wellness-profile.validation');

describe('isPositiveNumber', () => {
  test('returns true for positive integers', () => {
    expect(isPositiveNumber(10)).toBe(true);
    expect(isPositiveNumber('5000')).toBe(true);
  });

  test('returns true for positive decimals', () => {
    expect(isPositiveNumber(70.5)).toBe(true);
    expect(isPositiveNumber('65.3')).toBe(true);
  });

  test('returns false for zero', () => {
    expect(isPositiveNumber(0)).toBe(false);
  });

  test('returns false for negative numbers', () => {
    expect(isPositiveNumber(-1)).toBe(false);
  });

  test('returns false for non-numeric strings', () => {
    expect(isPositiveNumber('abc')).toBe(false);
    expect(isPositiveNumber('')).toBe(false);
  });

  test('returns false for null/undefined', () => {
    expect(isPositiveNumber(null)).toBe(false);
    expect(isPositiveNumber(undefined)).toBe(false);
  });
});

describe('validateWellnessProfile', () => {
  const validPayload = {
    currentWeight: 80,
    targetWeight: 70,
    stepTarget: 10000,
    activeMinutes: 30,
  };

  test('returns valid=true for a correct payload', () => {
    const result = validateWellnessProfile(validPayload);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  test('returns errors for all invalid fields', () => {
    const result = validateWellnessProfile({
      currentWeight: -5,
      targetWeight: 0,
      stepTarget: 'abc',
      activeMinutes: undefined,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('currentWeight');
    expect(result.errors).toHaveProperty('targetWeight');
    expect(result.errors).toHaveProperty('stepTarget');
    expect(result.errors).toHaveProperty('activeMinutes');
  });

  test('returns single error for one invalid field', () => {
    const result = validateWellnessProfile({ ...validPayload, stepTarget: -1 });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(1);
    expect(result.errors).toHaveProperty('stepTarget');
  });
});
