import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users, type User, type NewUser } from '../libs/auth/schema';

// Create Postgres client with neon.tech serverless postgres
const connectionString = process.env.DATABASE_URL || 
  'postgresql://neondb_owner:npg_SFgdyKq1mk3x@ep-crimson-rice-a585j8zw-pooler.us-east-2.aws.neon.tech/workflows_local?sslmode=require';

const client = postgres(connectionString);
export const db = drizzle(client);

// Export types
export type { User, NewUser };

// Export schema
export { users };
