/**
 * Server-side input validation for wellness profile.
 * Pure functions — no I/O, fully unit-testable.
 */

/**
 * Returns true if value is a finite, positive number.
 * @param {unknown} value
 * @returns {boolean}
 */
function isPositiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

/**
 * Validates the wellness profile payload.
 * @param {object} body
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
function validateWellnessProfile(body) {
  const errors = {};

  if (!isPositiveNumber(body.currentWeight)) {
    errors.currentWeight = 'Current weight must be a positive number.';
  }
  if (!isPositiveNumber(body.targetWeight)) {
    errors.targetWeight = 'Target weight must be a positive number.';
  }
  if (!isPositiveNumber(body.stepTarget)) {
    errors.stepTarget = 'Step target must be a positive number.';
  }
  if (!isPositiveNumber(body.activeMinutes)) {
    errors.activeMinutes = 'Active minutes must be a positive number.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

module.exports = { isPositiveNumber, validateWellnessProfile };
