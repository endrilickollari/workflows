import { Elysia, t } from "elysia";
import { userController } from '@/controllers/user.controller';
import { authMiddleware, userInfo } from '../middleware/auth';

// User response schema for Swagger documentation
const userResponseSchema = t.Object({
  id: t.Number({ description: "User ID" }),
  email: t.String({ description: "User email address" }),
  firstName: t.Optional(t.String({ description: "User first name" })),
  lastName: t.Optional(t.String({ description: "User last name" })),
  plan: t.String({ description: "User subscription plan" }),
  createdAt: t.String({ description: "Account creation date" }),
  updatedAt: t.String({ description: "Account last update date" }),
});

// API response schemas
const userListResponse = t.Object({
  success: t.Boolean({ description: "Operation success status" }),
  message: t.String({ description: "Response message" }),
  data: t.Array(userResponseSchema, { description: "List of users" }),
});

const userSingleResponse = t.Object({
  success: t.Boolean({ description: "Operation success status" }),
  message: t.String({ description: "Response message" }),
  data: userResponseSchema,
});

const messageResponse = t.Object({
  success: t.Boolean({ description: "Operation success status" }),
  message: t.String({ description: "Response message" }),
});

// User routes with auth middleware
export const userRoutes = new Elysia({ prefix: "/api/users" }) // Changed from /api/admin/users
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, requireAuth, set }) => {
      try {
        // Verify authentication
        const authResult = await requireAuth();
        if (!authResult.success) {
          set.status = 401;
          return {
            success: false,
            message: authResult.message || "Authentication required",
            data: {
              id: 0,
              email: "",
              firstName: undefined,
              lastName: undefined,
              plan: "",
              createdAt: "",
              updatedAt: ""
            }
          };
        }

        const result = await userController.createUser(body);

        if (!result.success) {
          set.status = 400;
          return {
            success: false,
            message: result.message,
            data: {
              id: 0,
              email: "",
              firstName: undefined,
              lastName: undefined,
              plan: "",
              createdAt: "",
              updatedAt: ""
            }
          };
        }

        // Ensure the response structure matches the schema exactly
        const responseData = result.data ? {
          id: result.data.id,
          email: result.data.email,
          firstName: result.data.firstName === null ? undefined : result.data.firstName,
          lastName: result.data.lastName === null ? undefined : result.data.lastName,
          plan: result.data.plan,
          createdAt: result.data.createdAt,
          updatedAt: result.data.updatedAt
        } : {
          id: 0,
          email: "",
          firstName: undefined,
          lastName: undefined,
          plan: "",
          createdAt: "",
          updatedAt: ""
        };

        return {
          success: true,
          message: result.message,
          data: responseData
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error",
          data: {
            id: 0,
            email: "",
            firstName: undefined,
            lastName: undefined,
            plan: "",
            createdAt: "",
            updatedAt: ""
          }
        };
      }
    },
    {
      body: t.Object({
        email: t.String({ format: "email", description: "User's email address" }),
        password: t.String({ minLength: 8, description: "User's password (min 8 characters)" }),
        firstName: t.Optional(t.String({ description: "User's first name" })),
        lastName: t.Optional(t.String({ description: "User's last name" })),
        plan: t.Optional(t.String({ description: "User's subscription plan (Free, Basic, Premium)" }))
      }),
      response: userSingleResponse,
      detail: {
        summary: "Create User",
        description: "Create a new user",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  )
  .get(
    "/",
    async ({ requireAuth, set }) => {
      try {
        // Verify authentication
        const authResult = await requireAuth();
        if (!authResult.success) {
          set.status = 401;
          return {
            success: false,
            message: authResult.message || "Authentication required",
            data: [] // Empty array for list response
          };
        }

        const result = await userController.getAllUsers();

        if (!result.success) {
          set.status = 500;
          return {
            success: false,
            message: result.message || "Failed to retrieve users",
            data: []
          };
        }

        // Ensure the response structure matches the schema exactly
        return {
          success: true,
          message: result.message,
          data: Array.isArray(result.data) ? result.data.map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName === null ? undefined : user.firstName,
            lastName: user.lastName === null ? undefined : user.lastName,
            plan: user.plan || "",
            createdAt: user.createdAt || "",
            updatedAt: user.updatedAt || ""
          })) : []
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error",
          data: []
        };
      }
    },
    {
      response: userListResponse,
      detail: {
        summary: "Get All Users",
        description: "Retrieve a list of all users",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, requireAuth, set }) => {
      try {
        // Verify authentication
        const authResult = await requireAuth();
        if (!authResult.success) {
          set.status = 401;
          return {
            success: false,
            message: authResult.message || "Authentication required",
            data: {
              id: 0,
              email: "",
              firstName: undefined,
              lastName: undefined,
              plan: "",
              createdAt: "",
              updatedAt: ""
            }
          };
        }

        const result = await userController.getUserById(id);

        if (!result.success) {
          set.status = result.message.includes("not found") ? 404 : 500;
          return {
            success: false,
            message: result.message,
            data: {
              id: 0,
              email: "",
              firstName: undefined,
              lastName: undefined,
              plan: "",
              createdAt: "",
              updatedAt: ""
            }
          };
        }

        // Ensure the response structure matches the schema exactly
        return {
          success: true,
          message: result.message,
          data: {
            id: result.data?.id ?? 0,
            email: result.data?.email ?? "",
            firstName: result.data?.firstName === null ? undefined : result.data?.firstName,
            lastName: result.data?.lastName === null ? undefined : result.data?.lastName,
            plan: result.data?.plan ?? "",
            createdAt: result.data?.createdAt ?? "",
            updatedAt: result.data?.updatedAt ?? ""
          }
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error",
          data: {
            id: 0,
            email: "",
            firstName: undefined,
            lastName: undefined,
            plan: "",
            createdAt: "",
            updatedAt: ""
          }
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "User ID" }),
      }),
      response: userSingleResponse,
      detail: {
        summary: "Get User by ID",
        description: "Retrieve a specific user by ID",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, requireAuth, set }) => {
      try {
        // Verify authentication
        const authResult = await requireAuth();
        if (!authResult.success) {
          set.status = 401;
          return {
            success: false,
            message: authResult.message || "Authentication required",
            data: {
              id: 0,
              email: "",
              firstName: undefined,
              lastName: undefined,
              plan: "",
              createdAt: "",
              updatedAt: ""
            }
          };
        }

        const result = await userController.updateUser(id, body);

        if (!result.success) {
          set.status = result.message.includes("not found") ? 404 : 400;
          return {
            success: false,
            message: result.message,
            data: {
              id: 0,
              email: "",
              firstName: undefined,
              lastName: undefined,
              plan: "",
              createdAt: "",
              updatedAt: ""
            }
          };
        }

        // Ensure the response structure matches the schema exactly
        return {
          success: true,
          message: result.message,
          data: {
            id: result.data?.id ?? 0,
            email: result.data?.email ?? "",
            firstName: result.data?.firstName === null ? undefined : result.data?.firstName,
            lastName: result.data?.lastName === null ? undefined : result.data?.lastName,
            plan: result.data?.plan ?? "",
            createdAt: result.data?.createdAt ?? "",
            updatedAt: result.data?.updatedAt ?? ""
          }
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error",
          data: {
            id: 0,
            email: "",
            firstName: undefined,
            lastName: undefined,
            plan: "",
            createdAt: "",
            updatedAt: ""
          }
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "User ID" }),
      }),
      body: t.Object({
        email: t.Optional(t.String({ format: "email", description: "User's email address" })),
        password: t.Optional(t.String({ minLength: 8, description: "User's password (min 8 characters)" })),
        firstName: t.Optional(t.String({ description: "User's first name" })),
        lastName: t.Optional(t.String({ description: "User's last name" })),
        plan: t.Optional(t.String({ description: "User's subscription plan (Free, Basic, Premium)" })),
      }),
      response: userSingleResponse,
      detail: {
        summary: "Update User",
        description: "Update a specific user by ID",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, requireAuth, set }) => {
      try {
        // Verify authentication
        const authResult = await requireAuth();
        if (!authResult.success) {
          set.status = 401;
          return {
            success: false,
            message: authResult.message || "Authentication required"
          };
        }

        const result = await userController.deleteUser(id);

        if (!result.success) {
          set.status = result.message.includes("not found") ? 404 : 500;
          return {
            success: false,
            message: result.message
          };
        }

        // Ensure the response structure matches the schema exactly
        return {
          success: true,
          message: result.message
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          message: error instanceof Error ? error.message : "Internal server error"
        };
      }
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "User ID" }),
      }),
      response: messageResponse,
      detail: {
        summary: "Delete User",
        description: "Delete a specific user by ID",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  );