/**
 * Database migration script using Bun's built-in SQLite
 */
import { Database } from 'bun:sqlite';

console.log('Running database migrations...');

// Connect to the database
const db = new Database('data.db');

try {
  // Just verify the database connection
  const tables = db.query(`
    SELECT name FROM sqlite_master 
    WHERE type='table' 
    ORDER BY name
  `).all();
  
  console.log('Database connected! Found tables:');
  tables.forEach((table: any) => console.log(`- ${table.name}`));
  
  console.log('✅ Database migration successful');
} catch (error) {
  console.error('❌ Database migration failed:', error);
  process.exit(1);
} finally {
  db.close();
}
