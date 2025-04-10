import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { cookie } from "@elysiajs/cookie";
import { authRoutes } from "./src/routes/auth.routes";
import { userRoutes } from "./src/routes/user.routes";
import { errorHandler } from "./src/middleware/error-handler";

// Define port
const PORT = process.env.PORT || 3000;

// Create Elysia app
const app = new Elysia()
  // Middleware
  .use(cors())
  .use(cookie())
  .use(errorHandler)
  
  // Routes
  .group("/api", app => app
    .use(authRoutes)
    .use(userRoutes)
  )
  
  // Base route
  .get("/", () => ({
    name: "User Management API",
    version: "1.0.0",
    status: "running",
  }))
  
  // Start server
  .listen(PORT);

console.log(`🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`);

// For hot module reloading during development (when running with --watch)
export type App = typeof app;