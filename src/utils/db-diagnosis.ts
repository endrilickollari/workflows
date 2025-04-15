/**
 * Database diagnosis tool - helps debug data type issues
 */
import { Database } from 'bun:sqlite';

/**
 * Print detailed information about the database schema and contents
 */
export function diagnoseBetterAuthDb(): void {
  const db = new Database('data.db', { readonly: true });
  
  try {
    // 1. Get list of all tables
    console.log('Checking database structure:');
    const tables = db.query("SELECT name FROM sqlite_master WHERE type='table'").all() as {name: string}[];
    console.log(`Found ${tables.length} tables: ${tables.map(t => t.name).join(', ')}`);
    
    // 2. Check each BetterAuth table
    const betterAuthTables = ['ba_users', 'ba_sessions', 'ba_accounts', 'ba_verifications'];
    for (const tableName of betterAuthTables) {
      if (!tables.some(t => t.name === tableName)) {
        console.log(`⚠️ Table ${tableName} does not exist!`);
        continue;
      }
      
      // 2a. Show table schema
      const schema = db.query(`PRAGMA table_info(${tableName})`).all();
      console.log(`\nSchema for ${tableName}:`);
      console.table(schema);
      
      // 2b. Count rows
      const count = db.query(`SELECT COUNT(*) as count FROM ${tableName}`).get() as {count: number};
      console.log(`Table ${tableName} has ${count.count} rows`);
      
      // 2c. Show sample data (first 3 rows)
      if (count.count > 0) {
        const rows = db.query(`SELECT * FROM ${tableName} LIMIT 3`).all();
        console.log(`Sample data from ${tableName}:`);
        console.log(rows);
      }
    }
  } finally {
    db.close();
  }
}

// If run directly, execute the diagnosis
if (import.meta.main) {
  console.log('Running database diagnosis...');
  diagnoseBetterAuthDb();
  console.log('\nDiagnosis complete');
}
