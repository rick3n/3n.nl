/**
 * @file validators/auth.js
 * @description Input validation helpers for auth endpoints.
 * Throws a structured VALIDATION_ERROR so the global error handler can
 * return a consistent 400 response with field-level detail.
 */

'use strict';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

/**
 * Builds and throws a structured validation error.
 * @param {Record<string, string>} fields - Map of field name → error message.
 */
const throwValidationError = (fields) => {
  const err = new Error('Validation failed');
  err.type = 'VALIDATION_ERROR';
  err.fields = fields;
  throw err;
};

/**
 * Validates the login request body.
 * Rules:
 *  - email   : required, valid email format
 *  - password : required, minimum 8 characters
 *
 * @param {{ email: unknown, password: unknown }} body
 * @throws {Error} VALIDATION_ERROR if any field is invalid
 */
const validateLoginInput = (body) => {
  const errors = {};
  const { email, password } = body ?? {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    errors.email = 'A valid email address is required.';
  }

  if (
    !password ||
    typeof password !== 'string' ||
    password.length < PASSWORD_MIN_LENGTH
  ) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (Object.keys(errors).length > 0) throwValidationError(errors);
};

module.exports = { validateLoginInput };
