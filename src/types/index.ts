import { User } from '../db';

/**
 * Authentication related types
 */

// JWT payload structure
export interface JwtPayload {
  id: number;
  email: string;
  plan: string;
  iat?: number;
  exp?: number;
}

// Response from authentication routes
export interface AuthResponse {
  success: boolean;
  data?: {
    token?: string;
    user?: {
      id: number;
      email: string;
      plan: string;
    };
  };
  message: string;
  error?: string;
}

/**
 * User related types
 */

// Sanitized user (for sending in responses, without sensitive data)
export type SanitizedUser = Omit<User, 'password'>;

// User creation request
export interface CreateUserDto {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
}

// User update request
export interface UpdateUserDto {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
}

/**
 * API response types
 */

// Generic success response
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message: string;
}

// Generic error response
export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
}

// API response
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
