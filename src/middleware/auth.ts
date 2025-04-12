import { Elysia } from 'elysia';
import { auth } from '@/libs/auth/auth';
import { User, Session } from 'better-auth/types';

// Create a plugin for authentication middleware
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .derive({ as: 'global' }, async ({ request, set, cookie }) => {
    // Function to get current session
    const getSession = async () => {
      try {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        if (!session) {
          return {
            success: false,
            message: 'Unauthorized: Not authenticated',
            user: null,
            session: null,
          };
        }

        return {
          success: true,
          user: session.user,
          session: session.session,
        };
      } catch (error) {
        console.error('Session error:', error);
        return {
          success: false,
          message: 'Error retrieving session',
          user: null,
          session: null,
        };
      }
    };

    // Function to require authentication
    const requireAuth = async () => {
      const sessionResult = await getSession();

      if (!sessionResult.success) {
        set.status = 401;
        return sessionResult;
      }

      return sessionResult;
    };

    // Function to require admin privileges
    const requireAdmin = async () => {
      const sessionResult = await requireAuth();

      if (!sessionResult.success) {
        return sessionResult;
      }

      // Check if user has admin privileges
      // if (!sessionResult.user.isAdmin) {
      //   set.status = 403;
      //   return {
      //     success: false,
      //     message: "Forbidden: Admin access required",
      //     user: null,
      //     session: null,
      //   };
      // }

      return sessionResult;
    };

    return {
      getSession,
      requireAuth,
      requireAdmin,
    };
  });

// Type for authenticated context
export type AuthenticatedContext = {
  user: User;
  session: Session;
};

// Helper to extract user info for response
export const userInfo = (user: User | null) => {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    // firstName: user.firstName,
    // lastName: user.lastName,
    // plan: user.plan,
    // isAdmin: user.isAdmin,
    image: user.image,
    emailVerified: user.emailVerified,
  };
};