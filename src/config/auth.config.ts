import {betterAuth} from "better-auth";
import Elysia from "elysia";

const {
    APPLE_CLIENT_ID,
    APPLE_CLIENT_SECRET,
    APPLE_APP_BUNDLE_IDENTIFIER,
} = process.env;

export const configureAuth = (app: Elysia) => {
    // Initialize Better Auth
    const auth = betterAuth({
        socialProviders: {
            apple: {
                clientId: APPLE_CLIENT_ID || 'your-client-id',
                clientSecret: APPLE_CLIENT_SECRET || 'your-client-secret',
                // Optional
                appBundleIdentifier: APPLE_APP_BUNDLE_IDENTIFIER,
            },
        },
        // Session configuration
        session: {
            cookieCache: {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            },
        },
    });

    // Attach auth to the app
    app.decorate('auth', auth);

    return app;
};