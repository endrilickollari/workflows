import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { cookie } from '@elysiajs/cookie';
import { swagger } from '@elysiajs/swagger';
import { userRoutes } from './routes/user.routes';
import { authRoutes } from './routes/auth.routes';
import { errorHandler } from './middleware/error-handler';
import { auth } from './libs/auth/auth';
import { version } from '../package.json';

// Define port
const PORT = process.env.PORT || 3000;

// Logger plugin
const logger = new Elysia()
  .onRequest(({ request }) => {
    console.log(`${new Date().toISOString()} | ${request.method} ${request.url}`);
  })
  .onAfterHandle(({ request, set }) => {
    console.log(`${new Date().toISOString()} | ${request.method} ${request.url} | ${set.status || 200}`);
  })
  .onAfterResponse(({ request, set }) => {
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
          title: 'User Management API',
          version,
          description: 'API for user management with enhanced authentication options',
        },
        tags: [
          { name: 'Authentication', description: 'Authentication endpoints including email and social providers' },
          { name: 'User Management', description: 'User CRUD operations (admin only)' },
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
              description: 'Enter your JWT token in the format: Bearer {token}',
            },
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

  // Mount auth routes
  .use(authRoutes)

  // Mount user management routes
  .use(userRoutes)

  // BetterAuth handler for all other auth routes not explicitly defined
  .all('/api/auth/*', async ({ request }) => {
    console.log(`Passing request to BetterAuth handler: ${request.method} ${request.url}`);
    return auth.handler(request);
  })

  // Base route
  .get('/', () => ({
    name: 'User Management API',
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

// For hot module reloading during development
export type App = typeof app;