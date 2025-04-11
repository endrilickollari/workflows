import { Context } from "elysia";
import { auth } from "./auth";

/**
 * Handler for BetterAuth requests
 * This will be used to handle all auth-related routes
 */
export const betterAuthView = (context: Context) => {
    const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

    if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
        return auth.handler(context.request);
    } else {
        context.error(405);
    }
};