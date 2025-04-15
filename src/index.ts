import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { cookie } from '@elysiajs/cookie';
import { swagger } from '@elysiajs/swagger';
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

  // Swagger documentation
  .use(swagger())

  // BetterAuth handler for auth routes
  .all('/api/auth/*', betterAuthView)

  // Base route
  .get('/', () => ({
    name: 'Norcha API',
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