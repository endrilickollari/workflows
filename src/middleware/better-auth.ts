import { Elysia } from "elysia";
import { auth } from "@/libs/auth/auth";
import { Session, User } from "better-auth/types";

/**
 * BetterAuth middleware for Elysia
 * This middleware provides user and session information for protected routes
 */
export const betterAuthMiddleware = new Elysia()
    .derive({ as: 'global' }, async ({ request, set }) => {
        return {
            // Get session and user from request headers
            getSession: async () => {
                const session = await auth.api.getSession({
                    headers: request.headers,
                });

                if (!session) {
                    set.status = 401;
                    return {
                        success: false,
                        message: "Unauthorized: Not authenticated"
                    };
                }

                return {
                    success: true,
                    user: session.user,
                    session: session.session
                };
            },

            // Check if user is admin
            verifyAdmin: async () => {
                const session = await auth.api.getSession({
                    headers: request.headers,
                });

                if (!session) {
                    set.status = 401;
                    return {
                        success: false,
                        message: "Unauthorized: Not authenticated"
                    };
                }

                // if (!session.user.isAdmin) {
                //     set.status = 403;
                //     return {
                //         success: false,
                //         message: "Forbidden: Admin access required"
                //     };
                // }

                return {
                    success: true,
                    user: session.user,
                    session: session.session
                };
            },
        };
    });

// Helper function to return user info
export const userInfo = (user: User | null, session: Session | null) => {
    return {
        user: user,
        session: session
    };
};