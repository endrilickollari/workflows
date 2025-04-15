/**
 * Reset database utility 
 */
import { Database } from 'bun:sqlite';

/**
 * Reset the database by dropping and recreating tables
 */
export async function resetDatabase(): Promise<boolean> {
  console.log('Resetting database...');
  
  const db = new Database('data.db', { create: true });
  
  try {
    // Start transaction
    db.exec('BEGIN TRANSACTION');
    
    // Drop all BetterAuth tables
    const tables = ['ba_users', 'ba_sessions', 'ba_accounts', 'ba_verifications'];
    for (const table of tables) {
      db.exec(`DROP TABLE IF EXISTS ${table}`);
      console.log(`Dropped table ${table}`);
    }
    
    // Commit transaction
    db.exec('COMMIT');
    
    console.log('Database reset successful!');
    return true;
  } catch (error) {
    // Rollback on error
    db.exec('ROLLBACK');
    console.error('Database reset failed:', error);
    return false;
  } finally {
    db.close();
  }
}

// If run directly, reset the database
if (import.meta.main) {
  resetDatabase().then(success => {
    if (success) {
      console.log('Database reset complete. You will need to run the migrations again.');
    } else {
      console.error('Failed to reset database.');
    }
  });
}
