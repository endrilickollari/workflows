import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { swagger } from "@elysiajs/swagger";
import { userRoutes } from "./routes/user.routes";
import { errorHandler } from "./middleware/error-handler";
import { auth } from "./libs/auth/auth";
import { version } from "../package.json";

// Define port
const PORT = process.env.PORT || 3000;

// BetterAuth debugging middleware
const logRequest = new Elysia()
  .onRequest(({ request }) => {
      console.log(`Request: ${request.method} ${request.url}`);
  });

// Create Elysia app
const app = new Elysia()
  // Debug requests
  .use(logRequest)

  // Middleware
  .use(cors({
      origin: ["http://localhost:3000", "http://localhost:3001"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
  }))
  .use(cookie())
  .use(errorHandler)

  // Swagger documentation
  .use(
    swagger({
        path: "/docs",
        documentation: {
            info: {
                title: "WorkflowAPI",
                version,
                description: "API for managing workflows",
            },
            tags: [
                { name: "Authentication", description: "Authentication endpoints" },
                { name: "User Management", description: "User CRUD operations (admin only)" },
            ],
            components: {
                securitySchemes: {
                    BearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                        description: "Enter your JWT token in the format: Bearer {token}",
                    },
                    CookieAuth: {
                        type: "apiKey",
                        in: "cookie",
                        name: "better_auth_session",
                        description: "BetterAuth session cookie",
                    },
                },
            },
        },
    })
  )

  // Manual handler for BetterAuth to catch all routes
  .all('/api/auth/*', async ({ request }) => {
      console.log(`Handling BetterAuth request: ${request.method} ${request.url}`);
      return auth.handler(request);
  })

  // BetterAuth debug route
  .get('/api/auth-test', () => {
      return {
          message: 'BetterAuth route test',
          authRoutes: [
              '/api/auth/signup/email-password',
              '/api/auth/signin/email-password',
              '/api/auth/signin/google',
              '/api/auth/session',
              '/api/auth/signout'
          ]
      };
  })

  // Regular routes
  .group("/api", app => app
    .use(userRoutes)
  )

  // Base route
  .get("/", () => ({
      name: "User Management API with BetterAuth",
      version,
      status: "running",
      documentation: "/docs",
      auth: "/api/auth",
  }))

  // Start server
  .listen(PORT);

console.log(`🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
console.log(`🔐 Auth Endpoints: http://localhost:${PORT}/api/auth`);

// For hot module reloading during development
export type App = typeof app;