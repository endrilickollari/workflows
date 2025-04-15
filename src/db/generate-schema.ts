/**
 * Direct script to create the BetterAuth schema without relying on the CLI
 */
import { Database } from 'bun:sqlite';
import fs from 'fs';
import path from 'path';

console.log('Manually generating BetterAuth schema...');

// Connect to the database using Bun's built-in SQLite
const db = new Database('data.db');

try {
  // Begin transaction
  db.exec('BEGIN TRANSACTION');
  
  // Create the necessary tables for BetterAuth
  
  // 1. ba_users table
  console.log('Creating ba_users table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS ba_users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      email_verified INTEGER DEFAULT 0,
      password TEXT,
      first_name TEXT,
      last_name TEXT,
      plan TEXT DEFAULT 'Free',
      image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 2. ba_sessions table
  console.log('Creating ba_sessions table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS ba_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 3. ba_accounts table
  console.log('Creating ba_accounts table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS ba_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (provider, provider_account_id)
    )
  `);
  
  // 4. ba_verifications table
  console.log('Creating ba_verifications table...');
  db.exec(`
    CREATE TABLE IF NOT EXISTS ba_verifications (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      token TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      identifier TEXT NOT NULL,
      value TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Commit the transaction
  db.exec('COMMIT');
  
  console.log('✅ BetterAuth schema created successfully');
  
  // Add diagnostic function to check environment variables
  console.log('\n📊 Running diagnostic checks...');
  
  // Check environment variables
  console.log('Checking OAuth environment variables:');
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!googleClientId || !googleClientSecret) {
    console.warn('⚠️  Warning: Google OAuth credentials are missing. Set these in your .env file:');
    console.warn('GOOGLE_CLIENT_ID=your-client-id');
    console.warn('GOOGLE_CLIENT_SECRET=your-client-secret');
    console.warn('Without these, Google sign-in will not work properly and may return empty responses.');
  } else {
    console.log('✅ Google OAuth credentials found in environment variables');
  }
  
  // Check if there are any users in the database
  try {
    const userCount = db.query('SELECT COUNT(*) as count FROM ba_users').get() as { count: number };
    console.log(`📝 Database contains ${userCount.count} users`);
  } catch (error) {
    console.error('Error checking user count:', error);
  }
} catch (error) {
  // Rollback on error
  db.exec('ROLLBACK');
  console.error('❌ Error creating BetterAuth schema:', error);
  process.exit(1);
} finally {
  // Close the database connection
  db.close();
}
