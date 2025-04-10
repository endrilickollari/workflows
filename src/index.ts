import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { swagger } from "@elysiajs/swagger";
import { authRoutes } from "./routes/auth.routes";
import { userRoutes } from "./routes/user.routes";
import { errorHandler } from "./middleware/error-handler";
import { version } from "../package.json";

// Define port
const PORT = process.env.PORT || 3000;

// Create Elysia app
const app = new Elysia()
  // Middleware
  .use(cors())
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
          },
        },
      },
    })
  )
  
  // Routes
  .group("/api", app => app
    .use(authRoutes)
    .use(userRoutes)
  )
  
  // Base route
  .get("/", () => ({
    name: "User Management API",
    version,
    status: "running",
    documentation: "/docs",
  }))
  
  // Start server
  .listen(PORT);

console.log(`🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`);
console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);

// For hot module reloading during development (when running with --watch)
export type App = typeof app;