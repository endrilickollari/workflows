import { Elysia, t } from 'elysia';
import { auth } from '@/libs/auth/auth';
import { userInfo } from '@/middleware/auth';

// Define response schemas for Swagger documentation
const userResponseSchema = t.Object({
  id: t.String({ description: 'User ID' }),
  email: t.String({ description: 'User email address' }),
  firstName: t.Optional(t.String({ description: 'User first name' })),
  lastName: t.Optional(t.String({ description: 'User last name' })),
  name: t.String({ description: 'User display name' }),
  emailVerified: t.Boolean({ description: 'Email verification status' }),
  plan: t.Optional(t.String({ description: 'User subscription plan' })),
  isAdmin: t.Optional(t.Boolean({ description: 'Admin status' })),
  image: t.Optional(t.Union([t.String(), t.Null()], { description: 'User profile image URL' })),
});

const authResponseSchema = t.Object({
  success: t.Boolean({ description: 'Operation success status' }),
  message: t.String({ description: 'Response message' }),
  data: t.Optional(t.Object({
    user: t.Optional(userResponseSchema),
    token: t.Optional(t.String({ description: 'Authentication token' })),
    redirect: t.Optional(t.Boolean({ description: 'Redirect flag' })),
    url: t.Optional(t.String({ description: 'Redirect URL' })),
  })),
});

// Auth routes for all authentication methods
export const authRoutes = new Elysia({ prefix: '/api/auth' })
  // Email signup
  .post('/sign-up/email',
    async ({ body, set }) => {
      try {
        const result = await auth.api.signUpEmail({
          body: {
            name: body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'User',
            email: body.email,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
            plan: body.plan,
          },
        });

        return {
          success: true,
          message: 'User registered successfully',
          data: {
            user: result.user ? {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              // firstName: result.user.firstName,
              // lastName: result.user.lastName,
              // plan: result.user.plan,
              // isAdmin: result.user.isAdmin,
              image: result.user.image,
              emailVerified: result.user.emailVerified,
            } : undefined,
            token: result.token || undefined,
          },
        };
      } catch (error: any) {
        console.error('Signup error:', error);
        set.status = error.status || 400;
        return {
          success: false,
          message: error.message || 'Registration failed',
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email', description: 'User email address' }),
        password: t.String({ minLength: 8, description: 'User password' }),
        name: t.Optional(t.String({ description: 'User display name' })),
        firstName: t.Optional(t.String({ description: 'User first name' })),
        lastName: t.Optional(t.String({ description: 'User last name' })),
        plan: t.Optional(t.String({ description: 'User subscription plan' })),
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
            callbackURL: body.callbackURL,
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
              // firstName: result.user.firstName,
              // lastName: result.user.lastName,
              // plan: result.user.plan,
              // isAdmin: result.user.isAdmin,
              image: result.user.image,
              emailVerified: result.user.emailVerified,
            } : undefined,
            token: result.token,
            redirect: result.redirect,
            url: result.url,
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
        callbackURL: t.Optional(t.String({ description: 'URL to redirect after login' })),
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

  // Google OAuth sign-in
  .post('/sign-in/google',
    async ({ body, set }) => {
      try {
        const result = await auth.api.signInSocial({
          body: {
            provider: 'google',
            callbackURL: body.callbackURL,
            disableRedirect: body.disableRedirect,
            scopes: body.scopes,
          },
        });

        if (result.redirect) {
          return {
            success: true,
            message: 'Redirecting to Google authentication',
            data: {
              redirect: true,
              url: result.url,
            },
          };
        }

        return {
          success: true,
          message: "Login successful",
          data: {
            user: 'user' in result && result.user ? {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              // firstName: result.user.firstName,
              // lastName: result.user.lastName,
              // plan: result.user.plan,
              // isAdmin: result.user.isAdmin,
              image: result.user.image,
              emailVerified: result.user.emailVerified,
            } : undefined,
            token: 'token' in result ? result.token : undefined
          }
        };
      } catch (error: any) {
        console.error('Google auth error:', error);
        set.status = error.status || 500;
        return {
          success: false,
          message: error.message || 'Google authentication failed',
        };
      }
    },
    {
      body: t.Object({
        callbackURL: t.Optional(t.String({ description: 'URL to redirect after authentication' })),
        disableRedirect: t.Optional(t.Boolean({ description: 'Return URL instead of redirecting' })),
        scopes: t.Optional(t.Array(t.String(), { description: 'OAuth scopes to request' })),
      }),
      response: authResponseSchema,
      detail: {
        summary: 'Google Sign In',
        description: 'Authenticate with Google OAuth',
        tags: ['Authentication'],
      },
    },
  )

  // GitHub OAuth sign-in
  .post('/sign-in/github',
    async ({ body, set }) => {
      try {
        const result = await auth.api.signInSocial({
          body: {
            provider: 'github',
            callbackURL: body.callbackURL,
            disableRedirect: body.disableRedirect,
            scopes: body.scopes,
          },
        });

        if (result.redirect) {
          return {
            success: true,
            message: 'Redirecting to GitHub authentication',
            data: {
              redirect: true,
              url: result.url,
            },
          };
        }

        return {
          success: true,
          message: "Login successful",
          data: {
            user: 'user' in result && result.user ? {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              // firstName: result.user.firstName,
              // lastName: result.user.lastName,
              // plan: result.user.plan,
              // isAdmin: result.user.isAdmin,
              image: result.user.image,
              emailVerified: result.user.emailVerified,
            } : undefined,
            token: 'token' in result ? result.token : undefined
          }
        };
      } catch (error: any) {
        console.error('GitHub auth error:', error);
        set.status = error.status || 500;
        return {
          success: false,
          message: error.message || 'GitHub authentication failed',
        };
      }
    },
    {
      body: t.Object({
        callbackURL: t.Optional(t.String({ description: 'URL to redirect after authentication' })),
        disableRedirect: t.Optional(t.Boolean({ description: 'Return URL instead of redirecting' })),
        scopes: t.Optional(t.Array(t.String(), { description: 'OAuth scopes to request' })),
      }),
      response: authResponseSchema,
      detail: {
        summary: 'GitHub Sign In',
        description: 'Authenticate with GitHub OAuth',
        tags: ['Authentication'],
      },
    },
  )

  .get("/session",
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
              // firstName: session.user.firstName,
              // lastName: session.user.lastName,
              // plan: session.user.plan,
              // isAdmin: session.user.isAdmin,
              image: session.user.image,
              emailVerified: session.user.emailVerified,
            } : undefined,
            session: {
              id: session.session.id,
              expiresAt: session.session.expiresAt,
              userId: session.session.userId,
              createdAt: session.session.createdAt,
              updatedAt: session.session.updatedAt,
              token: session.session.token
            }
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

  // OAuth callback handler (must be at the path that matches BetterAuth config)
  // .all('/callback/:id',
  //   async ({ params, query, body, request, set }) => {
  //     try {
  //       await auth.api.callbackOAuth({
  //         params: { id: params.id },
  //         query: query,
  //         body: body || {},
  //         headers: request.headers,
  //       });
  //
  //       // Redirect happens internally in BetterAuth
  //       return {
  //         success: true,
  //         message: 'Authentication successful',
  //       };
  //     } catch (error: any) {
  //       console.error('OAuth callback error:', error);
  //       set.status = error.status || 500;
  //       return {
  //         success: false,
  //         message: error.message || 'Authentication failed',
  //       };
  //     }
  //   },
  //   {
  //     params: t.Object({
  //       id: t.String({ description: 'Provider ID' }),
  //     }),
  //     query: t.Object({
  //       code: t.Optional(t.String()),
  //       state: t.Optional(t.String()),
  //       error: t.Optional(t.String()),
  //       error_description: t.Optional(t.String()),
  //     }),
  //     detail: {
  //       summary: 'OAuth Callback',
  //       description: 'Handle OAuth provider callback',
  //       tags: ['Authentication'],
  //     },
  //   },
  // )

  // Reset password request
  .post('/forget-password',
    async ({ body, set }) => {
      try {
        const result = await auth.api.forgetPassword({
          body: {
            email: body.email,
            redirectTo: body.redirectTo,
          },
        });

        return {
          success: true,
          message: 'Password reset email sent',
        };
      } catch (error: any) {
        console.error('Password reset error:', error);
        set.status = error.status || 400;
        return {
          success: false,
          message: error.message || 'Failed to send password reset email',
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email', description: 'User email address' }),
        redirectTo: t.Optional(t.String({ description: 'URL to redirect after password reset' })),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
      detail: {
        summary: 'Forget Password',
        description: 'Request a password reset email',
        tags: ['Authentication'],
      },
    },
  )

  // Reset password with token
  .post('/reset-password',
    async ({ body, query, set }) => {
      try {
        const result = await auth.api.resetPassword({
          body: {
            newPassword: body.newPassword,
            token: body.token || (query?.token as string),
          },
          query: {
            token: query?.token as string,
          },
        });

        return {
          success: true,
          message: 'Password reset successful',
        };
      } catch (error: any) {
        console.error('Password reset error:', error);
        set.status = error.status || 400;
        return {
          success: false,
          message: error.message || 'Failed to reset password',
        };
      }
    },
    {
      body: t.Object({
        newPassword: t.String({ minLength: 8, description: 'New password' }),
        token: t.Optional(t.String({ description: 'Reset token (if not provided in query)' })),
      }),
      query: t.Optional(t.Object({
        token: t.Optional(t.String({ description: 'Reset token' })),
      })),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
      detail: {
        summary: 'Reset Password',
        description: 'Reset password with token',
        tags: ['Authentication'],
      },
    },
  )

  // Verify email
  .get("/verify-email",
    async ({ query, set }) => {
      try {
        const result = await auth.api.verifyEmail({
          query: {
            token: query.token,
            callbackURL: query.callbackURL,
          },
        });

        // Check if result exists and has expected structure
        if (!result) {
          return {
            success: true,
            message: "Email verification processed",
          };
        }

        return {
          success: true,
          message: "Email verified successfully",
          data: {
            user: result.user ? {
              id: result.user.id,
              email: result.user.email,
              name: result.user.name,
              // firstName: result.user.firstName,
              // lastName: result.user.lastName,
              // plan: result.user.plan,
              // isAdmin: result.user.isAdmin,
              image: result.user.image,
              emailVerified: result.user.emailVerified,
            } : undefined,
            status: result.status
          }
        };
      } catch (error: any) {
        console.error("Email verification error:", error);
        set.status = error.status || 400;
        return {
          success: false,
          message: error.message || "Failed to verify email",
        };
      }
    },
    {
      query: t.Object({
        token: t.String({ description: 'Verification token' }),
        callbackURL: t.Optional(t.String({ description: 'URL to redirect after verification' })),
      }),
      response: authResponseSchema,
      detail: {
        summary: 'Verify Email',
        description: 'Verify email address with token',
        tags: ['Authentication'],
      },
    },
  )

  // Send verification email
  .post('/send-verification-email',
    async ({ body, set }) => {
      try {
        const result = await auth.api.sendVerificationEmail({
          body: {
            email: body.email,
            callbackURL: body.callbackURL,
          },
        });

        return {
          success: true,
          message: 'Verification email sent',
        };
      } catch (error: any) {
        console.error('Send verification email error:', error);
        set.status = error.status || 400;
        return {
          success: false,
          message: error.message || 'Failed to send verification email',
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email', description: 'User email address' }),
        callbackURL: t.Optional(t.String({ description: 'URL to redirect after verification' })),
      }),
      response: t.Object({
        success: t.Boolean(),
        message: t.String(),
      }),
      detail: {
        summary: 'Send Verification Email',
        description: 'Send a verification email to the user',
        tags: ['Authentication'],
      },
    },
  );