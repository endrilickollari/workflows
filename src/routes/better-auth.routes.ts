import { Elysia, t } from 'elysia';
import { auth } from '../libs/auth/auth';

// Explicitly define BetterAuth routes
export const betterAuthRoutes = new Elysia({ prefix: '/auth' })
  // Email signup (correct path is /sign-up/email)
  .post(
    '/sign-up/email',
    async ({ body, set }) => {
      console.log('Processing signup request:', body);
      try {
        // The signUpEmail method expects a context with body field
        const result = await auth.api.signUpEmail({
          body: {
            name: body.name || `${body.firstName || ''} ${body.lastName || ''}`.trim() || 'User',
            email: body.email,
            password: body.password,
            // Pass any additional fields
            ...(body.firstName ? { firstName: body.firstName } : {}),
            ...(body.lastName ? { lastName: body.lastName } : {}),
            ...(body.plan ? { plan: body.plan } : {}),
          },
        });

        return result;
      } catch (error: any) {
        console.error('Signup error:', error);
        set.status = error.status || 500;
        return {
          error: error.message || 'An error occurred during signup',
          status: error.status || 500,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
        name: t.Optional(t.String()),
        firstName: t.Optional(t.String()),
        lastName: t.Optional(t.String()),
        plan: t.Optional(t.String()),
      }),
    }
  )

  // Email signin (correct path is /sign-in/email)
  .post(
    '/sign-in/email',
    async ({ body, set }) => {
      console.log('Processing signin request:', body);
      try {
        // The signInEmail method expects a context with body
        const result = await auth.api.signInEmail({
          body: {
            email: body.email,
            password: body.password,
          },
        });

        return result;
      } catch (error: any) {
        console.error('Signin error:', error);
        set.status = error.status || 500;
        return {
          error: error.message || 'An error occurred during signin',
          status: error.status || 500,
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String(),
      }),
    }
  )

  // Get current session
  .get(
    '/get-session',
    async ({ request, set, query }) => {
      console.log('Getting session');
      try {
        const session = await auth.api.getSession({
          headers: request.headers,
          query: query,
        });

        if (!session) {
          set.status = 401;
          return { error: 'No active session', status: 401 };
        }

        return session;
      } catch (error: any) {
        console.error('Session error:', error);
        set.status = error.status || 500;
        return {
          error: error.message || 'An error occurred fetching session',
          status: error.status || 500,
        };
      }
    },
    {
      query: t.Optional(
        t.Object({
          disableCookieCache: t.Optional(t.Boolean()),
          disableRefresh: t.Optional(t.Boolean()),
        })
      ),
    }
  )

  // Session alias for compatibility
  // .get('/session', async ({ request, set, query }) => {
  //   return await betterAuthRoutes.handle({
  //     path: '/get-session',
  //     method: 'GET',
  //     headers: request.headers,
  //     query
  //   });
  // })

  // Sign out
  .post('/sign-out', async ({ request, set }) => {
    console.log('Processing signout request');
    try {
      const result = await auth.api.signOut({
        headers: request.headers,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Signout error:', error);
      set.status = error.status || 500;
      return {
        error: error.message || 'An error occurred during signout',
        status: error.status || 500,
      };
    }
  })

  // Initiate social signin (Google, etc.)
  .post(
    '/sign-in/social',
    async ({ body, set }) => {
      console.log('Initiating social signin:', body);
      try {
        const result = await auth.api.signInSocial({
          body: {
            provider: 'google',
            callbackURL: body.callbackURL,
            disableRedirect: body.disableRedirect,
          },
        });

        if (body.disableRedirect) {
          return { url: result.url, redirect: false };
        }

        // Redirect to auth page
        set.redirect = result.url;
        return { url: result.url, redirect: true };
      } catch (error: any) {
        console.error('Social signin error:', error);
        set.status = error.status || 500;
        return {
          error: error.message || 'Failed to initiate social signin',
          status: error.status || 500,
        };
      }
    },
    {
      body: t.Object({
        provider: t.String(),
        callbackURL: t.Optional(t.String()),
        disableRedirect: t.Optional(t.Boolean()),
      }),
    }
  );

// OAuth callback
// .all('/callback/:id', async ({ params, query, body, request, set }) => {
//   console.log('Processing OAuth callback:', params.id, query);
//   try {
//     // The callbackOAuth method expects a context with params, query or body
//     const result = await auth.api.callbackOAuth({
//       params: { id: params.id },
//       query: query || {},
//       body: body || {},
//       headers: request.headers
//     });
//
//     // If we get here without a redirect, return success
//     return { success: true };
//   } catch (error: any) {
//     console.error('OAuth callback error:', error);
//     set.status = error.status || 500;
//     return {
//       error: error.message || 'Failed to complete OAuth authentication',
//       status: error.status || 500
//     };
//   }
// });
