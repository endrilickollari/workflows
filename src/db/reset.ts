import { Database } from 'bun:sqlite';

console.log('Checking and resetting database...');

// Connect to the database
const sqlite = new Database('data.db', { create: true });

// Function to clean the database
async function resetDatabase() {
  try {
    console.log('Starting database reset');
    
    // Begin transaction
    sqlite.exec('BEGIN TRANSACTION');
    
    // Check if tables exist and drop them
    const tables = ['ba_users', 'ba_sessions', 'ba_accounts', 'ba_verifications', 'users'];
    for (const table of tables) {
      sqlite.exec(`DROP TABLE IF EXISTS ${table}`);
      console.log(`Dropped table ${table} if it existed`);
    }
    
    // Commit transaction
    sqlite.exec('COMMIT');
    console.log('Database reset successful');
  } catch (error) {
    // Rollback on error
    sqlite.exec('ROLLBACK');
    console.error('Database reset failed:', error);
  } finally {
    sqlite.close();
  }
}

// Run the reset
resetDatabase().then(() => console.log('Database reset complete'));
