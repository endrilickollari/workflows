import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import * as schema from './schema';

// Create a new SQLite database connection
const sqlite = new Database('data.db');

// Create a Drizzle instance with the database and schema
export const db = drizzle(sqlite, { schema });

// Export schema types for convenience
export * from './schema';
