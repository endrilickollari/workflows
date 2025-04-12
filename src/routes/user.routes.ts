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
  isAdmin: t.Boolean({ description: "Admin status" }),
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

// User routes with improved auth middleware
export const userRoutes = new Elysia({ prefix: "/api/admin/users" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, requireAdmin, set }) => {
      // Verify admin permissions
      const authResult = await requireAdmin();
      if (!authResult.success) return authResult;

      const result = await userController.createUser(body);

      if (!result.success) {
        set.status = 400;
      }

      return result;
    },
    {
      body: t.Object({
        email: t.String({ format: "email", description: "User's email address" }),
        password: t.String({ minLength: 8, description: "User's password (min 8 characters)" }),
        firstName: t.Optional(t.String({ description: "User's first name" })),
        lastName: t.Optional(t.String({ description: "User's last name" })),
        plan: t.Optional(t.String({ description: "User's subscription plan (Free, Basic, Premium)" })),
        isAdmin: t.Optional(t.Boolean({ description: "Whether the user has admin privileges" })),
      }),
      response: userSingleResponse,
      detail: {
        summary: "Create User",
        description: "Create a new user (admin access required)",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  )
  .get(
    "/",
    async ({ requireAdmin, set }) => {
      // Verify admin permissions
      const authResult = await requireAdmin();
      if (!authResult.success) return authResult;

      const result = await userController.getAllUsers();

      if (!result.success) {
        set.status = 500;
      }

      return result;
    },
    {
      response: userListResponse,
      detail: {
        summary: "Get All Users",
        description: "Retrieve a list of all users (admin access required)",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  )
  .get(
    "/:id",
    async ({ params: { id }, requireAdmin, set }) => {
      // Verify admin permissions
      const authResult = await requireAdmin();
      if (!authResult.success) return authResult;

      const result = await userController.getUserById(id);

      if (!result.success) {
        set.status = result.message.includes("not found") ? 404 : 500;
      }

      return result;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "User ID" }),
      }),
      response: userSingleResponse,
      detail: {
        summary: "Get User by ID",
        description: "Retrieve a specific user by ID (admin access required)",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  )
  .put(
    "/:id",
    async ({ params: { id }, body, requireAdmin, set }) => {
      // Verify admin permissions
      const authResult = await requireAdmin();
      if (!authResult.success) return authResult;

      const result = await userController.updateUser(id, body);

      if (!result.success) {
        set.status = result.message.includes("not found") ? 404 : 400;
      }

      return result;
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
        isAdmin: t.Optional(t.Boolean({ description: "Whether the user has admin privileges" })),
      }),
      response: userSingleResponse,
      detail: {
        summary: "Update User",
        description: "Update a specific user by ID (admin access required)",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  )
  .delete(
    "/:id",
    async ({ params: { id }, requireAdmin, set }) => {
      // Verify admin permissions
      const authResult = await requireAdmin();
      if (!authResult.success) return authResult;

      const result = await userController.deleteUser(id);

      if (!result.success) {
        set.status = result.message.includes("not found") ? 404 : 500;
      }

      return result;
    },
    {
      params: t.Object({
        id: t.Numeric({ description: "User ID" }),
      }),
      response: messageResponse,
      detail: {
        summary: "Delete User",
        description: "Delete a specific user by ID (admin access required)",
        tags: ["User Management"],
        security: [{ CookieAuth: [] }],
      }
    }
  );