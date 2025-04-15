import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../db";
import * as schema from "./schema";

export const auth = betterAuth({
  debug: process.env.NODE_ENV !== 'production',
  secret: process.env.BETTER_AUTH_SECRET || 'fallback-secret-key-12345',
  
  database: drizzleAdapter(db, {
    provider: 'sqlite', // Using SQLite instead of pg
    schema: {
      user: schema.users,
      session: schema.sessions,
      verification: schema.verifications,
      account: schema.accounts,
    },
  }),
  
  emailAndPassword: {  
    enabled: true, // Enable email and password authentication
    verifyEmail: false // For development simplicity
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
