import { Elysia, t } from "elysia";
import { authMiddleware, userInfo } from '../middleware/auth';

// User profile response schema for Swagger documentation
const userProfileSchema = t.Object({
  id: t.String({ description: "User ID" }),
  email: t.String({ description: "User email address" }),
  name: t.String({ description: "User display name" }),
  emailVerified: t.Boolean({ description: "Email verification status" }),
  image: t.Optional(t.Union([t.String(), t.Null()], { description: "User profile image URL" })),
});

// API response schemas
const profileResponse = t.Object({
  success: t.Boolean({ description: "Operation success status" }),
  message: t.String({ description: "Response message" }),
  data: t.Optional(userProfileSchema),
});

const messageResponse = t.Object({
  success: t.Boolean({ description: "Operation success status" }),
  message: t.String({ description: "Response message" }),
});

// User profile routes with auth middleware
export const profileRoutes = new Elysia({ prefix: "/api/profile" })
  .use(authMiddleware)
  .get("/", 
    async ({ requireAuth, set }) => {
      // Get authentication result
      const authResult = await requireAuth();
      
      // If not authenticated, return a properly formatted error response
      if (!authResult.success) {
        set.status = 401;
        return {
          success: false,
          message: authResult.message || "Authentication required",
          data: undefined
        };
      }

      // Extract user profile info in the correct format expected by the response schema
      const profileData = authResult.user ? {
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name || "",
        emailVerified: authResult.user.emailVerified,
        image: authResult.user.image
      } : undefined;

      // Return properly structured response matching the profileResponse schema
      return {
        success: true,
        message: "Profile retrieved successfully",
        data: profileData
      };
    },
    {
      response: profileResponse,
      detail: {
        summary: "Get User Profile",
        description: "Retrieve the authenticated user's profile",
        tags: ["Profile"],
        security: [{ CookieAuth: [] }],
      }
    }
  );
