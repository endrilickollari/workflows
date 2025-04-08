import {drizzle} from 'drizzle-orm/bun-sqlite';
import {Database} from 'bun:sqlite';
import {migrate} from 'drizzle-orm/bun-sqlite/migrator';

// Initialize SQLite database
const sqlite = new Database('sqlite.db');
export const db = drizzle(sqlite);

// Function to run migrations
export const runMigrations = () => {
    try {
        migrate(db, {migrationsFolder: './drizzle'});
        console.log('✅ Database migrations completed successfully');
    } catch (error) {
        console.error('❌ Error running database migrations:', error);
        process.exit(1);
    }
};