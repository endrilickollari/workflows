import { Database } from 'bun:sqlite';

/**
 * Comprehensive SQLite database inspector
 */
export function inspectSqliteDb(dbPath: string = 'data.db'): void {
  console.log(`Inspecting SQLite database at ${dbPath}`);
  
  // Connect to the database in read-only mode
  const db = new Database(dbPath, { readonly: true });
  
  try {
    // Get list of all tables
    const tables = db.query(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `).all() as { name: string }[];
    
    console.log(`\n📊 Database contains ${tables.length} tables:`);
    tables.forEach(t => console.log(`- ${t.name}`));
    
    // Examine each table
    for (const { name } of tables) {
      console.log(`\n📋 TABLE: ${name} 📋`);
      
      // Get schema information
      const schema = db.query(`PRAGMA table_info(${name})`).all();
      console.log('Schema definition:');
      console.table(schema);
      
      // Get row count
      const countResult = db.query(`SELECT COUNT(*) as count FROM ${name}`).get() as { count: number };
      console.log(`Contains ${countResult.count} rows`);
      
      // Show sample data for non-empty tables (limited to 2 rows)
      if (countResult.count > 0) {
        console.log('Sample data:');
        const rows = db.query(`SELECT * FROM ${name} LIMIT 2`).all();
        console.log(JSON.stringify(rows, null, 2));
      }
      
      // Check for foreign keys
      const foreignKeys = db.query(`PRAGMA foreign_key_list(${name})`).all();
      if (foreignKeys.length > 0) {
        console.log('Foreign key relationships:');
        console.table(foreignKeys);
      }
      
      // Check for indexes
      const indexes = db.query(`PRAGMA index_list(${name})`).all();
      if (indexes.length > 0) {
        console.log('Indexes:');
        console.table(indexes);
      }
    }
    
    console.log('\n✅ Database inspection complete');
  } catch (error) {
    console.error('❌ Error during database inspection:', error);
  } finally {
    db.close();
  }
}

// Run inspection if this file is executed directly
if (import.meta.main) {
  inspectSqliteDb();
}
