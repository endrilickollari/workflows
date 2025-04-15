/**
 * Execute Drizzle migrations against the database
 */
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { db } from '../src/db';
import path from 'path';
import fs from 'fs';

async function runMigrations() {
  console.log('🔄 Applying Drizzle migrations...');
  
  try {
    // Specify the directory containing the migration files
    const migrationsFolder = path.join(process.cwd(), 'drizzle', 'migrations');
    const metaDir = path.join(migrationsFolder, 'meta');
    const journalPath = path.join(metaDir, '_journal.json');
    
    // Ensure meta directory exists
    if (!fs.existsSync(metaDir)) {
      fs.mkdirSync(metaDir, { recursive: true });
    }
    
    // Check if journal file exists, create it if not
    if (!fs.existsSync(journalPath)) {
      console.log('Creating journal file...');
      const journalContent = {
        "version": "5",
        "dialect": "pg",
        "entries": []
      };
      fs.writeFileSync(journalPath, JSON.stringify(journalContent, null, 2));
    }
    
    // Run the migrations
    console.log('Running migrations from:', migrationsFolder);
    await migrate(db, { migrationsFolder });
    
    console.log('✅ Database migrations applied successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigrations();
