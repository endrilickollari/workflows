import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { authController } from "../controllers/auth.controller";

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

// Auth routes
export const authRoutes = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    })
  )
  .post(
    "/signup",
    async ({ body }) => {
      return await authController.signup(body);
    },
    {
      body: t.Object({
        email: t.String({ format: "email", description: "User's email address" }),
        password: t.String({ minLength: 6, description: "User's password (min 6 characters)" }),
        firstName: t.Optional(t.String({ description: "User's first name" })),
        lastName: t.Optional(t.String({ description: "User's last name" })),
        plan: t.Optional(t.String({ description: "User's subscription plan (Free, Basic, Premium)" })),
      }),
      detail: {
        summary: "User Registration",
        description: "Register a new user in the system",
        tags: ["Authentication"],
        responses: {
          200: {
            description: "User registered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        id: { type: "number", example: 1 },
                        email: { type: "string", example: "user@example.com" }
                      }
                    },
                    message: { type: "string", example: "User registered successfully" }
                  }
                }
              }
            }
          }
        }
      }
    }
  )
  .post(
    "/login",
    async ({ body, jwt }) => {
      // Pass token generation function to controller
      return await authController.login(body, (payload) => jwt.sign(payload));
    },
    {
      body: t.Object({
        email: t.String({ format: "email", description: "User's email address" }),
        password: t.String({ description: "User's password" }),
      }),
      detail: {
        summary: "User Login",
        description: "Authenticate a user and return a JWT token",
        tags: ["Authentication"],
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "object",
                      properties: {
                        token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                        user: {
                          type: "object",
                          properties: {
                            id: { type: "number", example: 1 },
                            email: { type: "string", example: "user@example.com" },
                            plan: { type: "string", example: "Free" }
                          }
                        }
                      }
                    },
                    message: { type: "string", example: "Login successful" }
                  }
                }
              }
            }
          },
          401: {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Invalid email or password" }
                  }
                }
              }
            }
          }
        }
      }
    }
  );