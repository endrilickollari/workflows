import { Elysia, t } from 'elysia';
import { auth } from '../libs/auth/auth';

// Define response schemas for Swagger documentation
const userResponseSchema = t.Object({
  id: t.String({ description: 'User ID' }),
  email: t.String({ description: 'User email address' }),
  name: t.String({ description: 'User display name' }),
  emailVerified: t.Boolean({ description: 'Email verification status' }),
  image: t.Optional(t.Union([t.String(), t.Null()], { description: 'User profile image URL' })),
});

const authResponseSchema = t.Object({
  success: t.Boolean({ description: 'Operation success status' }),
  message: t.String({ description: 'Response message' }),
  data: t.Optional(t.Object({
    user: t.Optional(userResponseSchema),
    token: t.Optional(t.String({ description: 'Authentication token' })),
  })),
});

// Auth routes for email/password authentication
export const authRoutes = new Elysia({ prefix: '/api/auth' })
  // Email signup
  .post('/sign-up/email',
    async ({ body, set }) => {
      try {
        console.log('Sign-up attempt:', { 
          email: body.email,
          name: body.name || body.email.split('@')[0] // Use part of email as fallback name
        });
        
        // Create a properly formatted body with required fields
        const authBody = {
          email: body.email,
          password: body.password,
          name: body.name || body.email.split('@')[0], // Default name if not provided
          image: body.image
        };
        
        // Use BetterAuth for signup
        const result = await auth.api.signUpEmail({
          body: authBody,
        });

        console.log('User created successfully with BetterAuth:', result.user?.id);
        
        return {
          success: true,
          message: 'User registered successfully',
          data: {
            user: result.user ? {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              image: result.user.image,
              emailVerified: result.user.emailVerified,
            } : undefined,
            token: result.token || undefined,
          },
        };
      } catch (error: any) {
        console.error('Signup failed:', error);
        set.status = error.status || 400;
        return {
          success: false,
          message: error.body?.message || error.message || 'Failed to create user',
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email', description: 'User email address' }),
        password: t.String({ minLength: 8, description: 'User password' }),
        name: t.Optional(t.String({ description: 'User display name' })),
        image: t.Optional(t.String({ description: 'User profile image URL' })),
      }),
      response: authResponseSchema,
      detail: {
        summary: 'Email Registration',
        description: 'Register a new user with email and password',
        tags: ['Authentication'],
      },
    },
  )
  
  // Email login
  .post('/sign-in/email',
    async ({ body, set }) => {
      try {
        const result = await auth.api.signInEmail({
          body: {
            email: body.email,
            password: body.password,
            rememberMe: body.rememberMe,
          },
        });

        return {
          success: true,
          message: 'Login successful',
          data: {
            user: result.user ? {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              image: result.user.image,
              emailVerified: result.user.emailVerified,
            } : undefined,
            token: result.token
          },
        };
      } catch (error: any) {
        console.error('Login error:', error);
        set.status = error.status || 401;
        return {
          success: false,
          message: error.message || 'Invalid email or password',
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email', description: 'User email address' }),
        password: t.String({ description: 'User password' }),
        rememberMe: t.Optional(t.Boolean({ description: 'Remember login session' })),
      }),
      response: authResponseSchema,
      detail: {
        summary: 'Email Login',
        description: 'Authenticate with email and password',
        tags: ['Authentication'],
      },
    },
  )
  
  // Sign out
  .post('/sign-out',
    async ({ request, set }) => {
      try {
        await auth.api.signOut({
          headers: request.headers,
        });

        return {
          success: true,
          message: 'Logged out successfully',
        };
      } catch (error: any) {
        console.error('Logout error:', error);
        set.status = error.status || 500;
        return {
          success: false,
          message: error.message || 'Failed to log out',
        };
      }
    },
    {
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
      detail: {
        summary: 'Sign Out',
        description: 'Log out the current user',
        tags: ['Authentication'],
        security: [{ CookieAuth: [] }],
      },
    },
  )

  // Get session
  .get('/session',
    async ({ request, set }) => {
      try {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        if (!session) {
          return {
            success: false,
            message: "No active session",
          };
        }

        return {
          success: true,
          message: "Session retrieved",
          data: {
            user: session.user ? {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
              emailVerified: session.user.emailVerified,
            } : undefined
          }
        };
      } catch (error: any) {
        console.error("Session error:", error);
        set.status = error.status || 401;
        return {
          success: false,
          message: error.message || "Failed to retrieve session",
        };
      }
    },
    {
      response: authResponseSchema,
      detail: {
        summary: 'Get Session',
        description: 'Get the current user session',
        tags: ['Authentication'],
        security: [{ CookieAuth: [] }],
      },
    },
  );

export default authRoutes;