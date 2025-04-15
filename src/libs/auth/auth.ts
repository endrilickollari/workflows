import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db";
import * as schema from "./schema";

export const auth = betterAuth({
  debug: process.env.NODE_ENV !== 'production',
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-key-12345',
  
  database: drizzleAdapter(db, {
    provider: 'pg', // Using PostgreSQL
    schema: {
      user: schema.users,
      session: schema.sessions,
      verification: schema.verifications,
      account: schema.accounts,
    },
  }),
  
  emailAndPassword: {  
    enabled: true, // Enable email/password authentication
    minPasswordLength: 8,
    maxPasswordLength: 128,
    disableSignUp: false, // Allow users to sign up
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    
    // Send password reset email
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log('Send password reset email to:', user.email);
      console.log('Reset password URL:', url);
      console.log('Reset token:', token);
      
      // TODO: Implement actual email sending
      // For now, just log the details for development purposes
      console.log(`
        To: ${user.email}
        Subject: Reset your password
        Body: Click the link to reset your password: ${url}
      `);
    },
  },
  
  // Email verification configuration
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      console.log('Send verification email to:', user.email);
      console.log('Verification URL:', url);
      console.log('Verification token:', token);
      
      // TODO: Implement actual email sending
      // For now, just log the details for development purposes
      console.log(`
        To: ${user.email}
        Subject: Verify your email address
        Body: Click the link to verify your email: ${url}
      `);
    },
  },
  
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
  },
});

export type AuthContext = typeof auth.$context;
