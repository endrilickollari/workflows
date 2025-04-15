/**
 * Application constants
 */

// User plans
export const USER_PLANS = {
  FREE: 'Free',
  BASIC: 'Basic',
  PREMIUM: 'Premium',
};

// Error messages
export const ERROR_MESSAGES = {
  USER_EXISTS: 'User with this email already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_PLAN: 'Invalid plan type',
  UNAUTHORIZED: "Unauthorized: You don't have permission to access this resource",
};

// Success messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  USER_REGISTERED: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
};

// API defaults
export const API_DEFAULTS = {
  DEFAULT_PLAN: USER_PLANS.FREE,
  JWT_EXPIRY: '24h', // Token expiry time
};
