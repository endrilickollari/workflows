import { Elysia } from 'elysia';

/**
 * Global error handling middleware
 */
export const errorHandler = new Elysia().onError(({ code, error, set }) => {
  console.error(`Error ${code}: ${error.message}`);

  // Set appropriate status code based on error
  switch (code) {
    case 'NOT_FOUND':
      set.status = 404;
      return {
        success: false,
        message: 'Resource not found',
        error: error.message,
      };

    case 'VALIDATION':
      set.status = 400;
      return {
        success: false,
        message: 'Validation error',
        error: error.message,
      };

    case 'PARSE':
      set.status = 400;
      return {
        success: false,
        message: 'Invalid request format',
        error: error.message,
      };

    case 'INTERNAL_SERVER_ERROR':
    default:
      set.status = 500;
      return {
        success: false,
        message: 'Internal server error',
        // Don't expose detailed errors in production
        error:
          process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
      };
  }
});
