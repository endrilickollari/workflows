import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, type User, type NewUser } from '../libs/auth/schema';

// Create Postgres client with neon.tech serverless postgres
const connectionString = process.env.DATABASE_URL || 
  '';

const client = postgres(connectionString);
export const db = drizzle(client);

// Export types
export type { User, NewUser };

// Export schema
export { users };
