import { Elysia } from 'elysia';
import { Session, User } from "better-auth/types";
import { auth } from '../libs/auth/auth';

// Create middleware for authentication
export const authMiddleware = new Elysia({ name: 'auth-middleware' })
  .derive({ as: 'global' }, async ({ request, set }) => {
    // Get session function
    const getSession = async () => {
      try {
        const session = await auth.api.getSession({ 
          headers: request.headers 
        });
        
        if (!session) {
          set.status = 401;
          return { 
            success: false, 
            message: "Unauthorized Access: Token is missing" 
          };
        }
        
        return {
          success: true,
          user: session.user,
          session: session.session
        };
      } catch (error) {
        console.error('Session error:', error);
        set.status = 401;
        return { 
          success: false, 
          message: "Error retrieving session"
        };
      }
    };
    
    // Require auth function
    const requireAuth = async () => {
      return await getSession();
    };
    
    return {
      getSession,
      requireAuth
    };
  });

// Type for authenticated context
export type AuthenticatedContext = {
  user: User;
  session: Session;
};

// Helper to extract user info
export const userInfo = (user: User | null, session: Session | null) => {
  return {
    user: user,
    session: session
  };
};