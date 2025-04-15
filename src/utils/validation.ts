import { z } from 'zod';
import { USER_PLANS } from './constants';

/**
 * Validation schemas for API requests
 */

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must be less than 255 characters');

// Password validation schema
export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters');

// User plan validation schema
export const planSchema = z.enum([USER_PLANS.FREE, USER_PLANS.BASIC, USER_PLANS.PREMIUM] as [
  string,
  ...string[],
]);

// User signup validation schema
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  plan: planSchema.optional().default(USER_PLANS.FREE),
});

// User login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

// User create validation schema
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  plan: planSchema.optional().default(USER_PLANS.FREE),
});

// User update validation schema
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  plan: planSchema.optional(),
});

/**
 * Validate data using a Zod schema
 */
export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: boolean; data?: T; error?: string } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }
    return { success: false, error: 'Validation failed' };
  }
}
