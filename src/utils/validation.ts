import { z } from 'zod';

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

// User login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

// User create validation schema
export const createUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().max(100).optional(),
  image: z.string().url().optional(),
});

// User update validation schema
export const updateUserSchema = z.object({
  email: emailSchema.optional(),
  password: passwordSchema.optional(),
  name: z.string().max(100).optional(),
  image: z.string().url().optional(),
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
