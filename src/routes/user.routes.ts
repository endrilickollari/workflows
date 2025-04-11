import { Elysia, t } from "elysia";
import { userController } from '@/controllers/user.controller';
import { betterAuthMiddleware } from '@/middleware/better-auth';

// User routes (admin only)
export const userRoutes = new Elysia({ prefix: "/admin/users" })
    .use(betterAuthMiddleware)
    .post(
        "/",
        async ({ body, verifyAdmin }) => {
          // Verify admin permissions
          const adminCheck = await verifyAdmin();
          if (!adminCheck.success) return adminCheck;

          return await userController.createUser(body);
        },
        {
          body: t.Object({
            email: t.String({ format: "email", description: "User's email address" }),
            password: t.String({ minLength: 6, description: "User's password (min 6 characters)" }),
            firstName: t.Optional(t.String({ description: "User's first name" })),
            lastName: t.Optional(t.String({ description: "User's last name" })),
            plan: t.Optional(t.String({ description: "User's subscription plan (Free, Basic, Premium)" })),
            isAdmin: t.Optional(t.Boolean({ description: "Whether the user has admin privileges" })),
          }),
          detail: {
            summary: "Create User",
            description: "Create a new user (admin access required)",
            tags: ["User Management"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "User created successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        data: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            email: { type: "string" },
                            firstName: { type: "string" },
                            lastName: { type: "string" },
                            plan: { type: "string" },
                            isAdmin: { type: "boolean" },
                            createdAt: { type: "string" },
                            updatedAt: { type: "string" }
                          }
                        },
                        message: { type: "string" }
                      }
                    }
                  }
                }
              },
              401: { description: "Unauthorized" },
              403: { description: "Forbidden - Admin access required" }
            }
          }
        }
    )
    .get("/", async ({ verifyAdmin }) => {
      // Verify admin permissions
      const adminCheck = await verifyAdmin();
      if (!adminCheck.success) return adminCheck;

      return await userController.getAllUsers();
    }, {
      detail: {
        summary: "Get All Users",
        description: "Retrieve a list of all users (admin access required)",
        tags: ["User Management"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          email: { type: "string" },
                          firstName: { type: "string" },
                          lastName: { type: "string" },
                          plan: { type: "string" },
                          isAdmin: { type: "boolean" },
                          createdAt: { type: "string" },
                          updatedAt: { type: "string" }
                        }
                      }
                    },
                    message: { type: "string" }
                  }
                }
              }
            }
          },
          401: { description: "Unauthorized" },
          403: { description: "Forbidden - Admin access required" }
        }
      }
    })
    .get(
        "/:id",
        async ({ params: { id }, verifyAdmin }) => {
          // Verify admin permissions
          const adminCheck = await verifyAdmin();
          if (!adminCheck.success) return adminCheck;

          return await userController.getUserById(id);
        },
        {
          params: t.Object({
            id: t.Number({ description: "User ID" }),
          }),
          detail: {
            summary: "Get User by ID",
            description: "Retrieve a specific user by ID (admin access required)",
            tags: ["User Management"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "User details",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        data: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            email: { type: "string" },
                            firstName: { type: "string" },
                            lastName: { type: "string" },
                            plan: { type: "string" },
                            isAdmin: { type: "boolean" },
                            createdAt: { type: "string" },
                            updatedAt: { type: "string" }
                          }
                        },
                        message: { type: "string" }
                      }
                    }
                  }
                }
              },
              401: { description: "Unauthorized" },
              403: { description: "Forbidden - Admin access required" },
              404: { description: "User not found" }
            }
          }
        }
    )
    .put(
        "/:id",
        async ({ params: { id }, body, verifyAdmin }) => {
          // Verify admin permissions
          const adminCheck = await verifyAdmin();
          if (!adminCheck.success) return adminCheck;

          return await userController.updateUser(id, body);
        },
        {
          params: t.Object({
            id: t.Number({ description: "User ID" }),
          }),
          body: t.Object({
            email: t.Optional(t.String({ format: "email", description: "User's email address" })),
            password: t.Optional(t.String({ minLength: 6, description: "User's password (min 6 characters)" })),
            firstName: t.Optional(t.String({ description: "User's first name" })),
            lastName: t.Optional(t.String({ description: "User's last name" })),
            plan: t.Optional(t.String({ description: "User's subscription plan (Free, Basic, Premium)" })),
            isAdmin: t.Optional(t.Boolean({ description: "Whether the user has admin privileges" })),
          }),
          detail: {
            summary: "Update User",
            description: "Update a specific user by ID (admin access required)",
            tags: ["User Management"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "User updated successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        data: {
                          type: "object",
                          properties: {
                            id: { type: "string" },
                            email: { type: "string" },
                            firstName: { type: "string" },
                            lastName: { type: "string" },
                            plan: { type: "string" },
                            isAdmin: { type: "boolean" },
                            createdAt: { type: "string" },
                            updatedAt: { type: "string" }
                          }
                        },
                        message: { type: "string" }
                      }
                    }
                  }
                }
              },
              401: { description: "Unauthorized" },
              403: { description: "Forbidden - Admin access required" },
              404: { description: "User not found" }
            }
          }
        }
    )
    .delete(
        "/:id",
        async ({ params: { id }, verifyAdmin }) => {
          // Verify admin permissions
          const adminCheck = await verifyAdmin();
          if (!adminCheck.success) return adminCheck;

          return await userController.deleteUser(id);
        },
        {
          params: t.Object({
            id: t.Number({ description: "User ID" }),
          }),
          detail: {
            summary: "Delete User",
            description: "Delete a specific user by ID (admin access required)",
            tags: ["User Management"],
            security: [{ BearerAuth: [] }],
            responses: {
              200: {
                description: "User deleted successfully",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      properties: {
                        success: { type: "boolean", example: true },
                        message: { type: "string", example: "User deleted successfully" }
                      }
                    }
                  }
                }
              },
              401: { description: "Unauthorized" },
              403: { description: "Forbidden - Admin access required" },
              404: { description: "User not found" }
            }
          }
        }
    );