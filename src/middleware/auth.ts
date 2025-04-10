import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use environment variable in production

// Authentication middleware
export const authMiddleware = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    })
  )
  .derive({as: 'global'}, ({ jwt, set, headers }) => {
    return {
      // Middleware to verify JWT token
      verifyToken: async () => {
        // Get token from Authorization header
        const authHeader = headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          set.status = 401;
          return { success: false, message: "Unauthorized: No token provided" };
        }

        const token = authHeader.split(" ")[1];
        const payload = await jwt.verify(token);

        if (!payload) {
          set.status = 401;
          return { success: false, message: "Unauthorized: Invalid token" };
        }

        return { success: true, user: payload };
      },

      // Middleware to verify admin permissions
      verifyAdmin: async () => {
        const tokenResult = await jwt.verify(headers.authorization?.split(" ")[1] || "");
        
        if (!tokenResult) {
          set.status = 401;
          return { success: false, message: "Unauthorized: Invalid token" };
        }

        if (!tokenResult.isAdmin) {
          set.status = 403;
          return { success: false, message: "Forbidden: Admin access required" };
        }

        return { success: true, user: tokenResult };
      },
    };
  });