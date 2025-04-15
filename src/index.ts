import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { cookie } from '@elysiajs/cookie';
import { swagger } from '@elysiajs/swagger';
import { profileRoutes } from './routes/profile.routes';
import { userRoutes } from './routes/user.routes';
import { errorHandler } from './middleware/error-handler';
import betterAuthView from './libs/auth/auth-view';
import { version } from '../package.json';

// Define port
const PORT = process.env.PORT || 3000;

// Logger plugin
const logger = new Elysia()
  .onRequest(({ request }) => {
    console.log(`${new Date().toISOString()} | ${request.method} ${request.url}`);
  })
  .onError(({ request, error }) => {
    console.error(`${new Date().toISOString()} | ${request.method} ${request.url} | Error: ${error.toString()}`);
  });

// Create Elysia app
const app = new Elysia()
  // Middleware
  .use(logger)
  .use(cors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }))
  .use(cookie())
  .use(errorHandler)

  // Swagger documentation
  .use(
    swagger({
      path: '/docs',
      documentation: {
        info: {
          title: 'User Authentication API',
          version,
          description: 'API for user authentication and profile management with BetterAuth',
        },
        tags: [
          { name: 'Authentication', description: 'Authentication endpoints including email and social providers' },
          { name: 'Profile', description: 'User profile management' },
        ],
        components: {
          securitySchemes: {
            CookieAuth: {
              type: 'apiKey',
              in: 'cookie',
              name: 'better_auth_session',
              description: 'BetterAuth session cookie',
            },
          },
        },
      },
    }),
  )
  
  // Mount user routes
  .use(userRoutes)

  // Mount profile routes
  .use(profileRoutes)

  // BetterAuth handler for all auth routes
  .all('/api/auth/*', betterAuthView)

  // Base route
  .get('/', () => ({
    name: 'User Authentication API',
    version,
    status: 'running',
    documentation: '/docs',
    auth: '/api/auth',
  }))

  // Start server
  .listen(PORT);

console.log(`🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
console.log(`🔐 Auth Endpoints: http://localhost:${PORT}/api/auth`);
console.log(`
📝 Test email sign-up with:
curl -X POST http://localhost:${PORT}/api/auth/sign-up/email \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

🔑 Test Google sign-in with:
curl -X POST http://localhost:${PORT}/api/auth/sign-in/google \\
  -H "Content-Type: application/json" \\
  -d '{"callbackURL":"http://localhost:${PORT}/auth-callback","disableRedirect":true}'
`);

// For hot module reloading during development
export type App = typeof app;