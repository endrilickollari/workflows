/**
 * Direct setup script for PostgreSQL database
 * This script creates the tables directly using the database connection
 */
import { db } from '../src/db';
import { sql } from 'drizzle-orm';

async function setupDatabase() {
  console.log('🔄 Setting up database tables directly...');
  
  try {
    // Create tables directly using SQL
    await db.execute(sql`
      -- Users table
      CREATE TABLE IF NOT EXISTS "user" (
        "id" TEXT PRIMARY KEY,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "email_verified" BOOLEAN DEFAULT FALSE,
        "image" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Sessions table
      CREATE TABLE IF NOT EXISTS "session" (
        "id" TEXT PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "token" TEXT NOT NULL UNIQUE,
        "expires_at" TIMESTAMP NOT NULL,
        "ip_address" TEXT,
        "user_agent" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Accounts table
      CREATE TABLE IF NOT EXISTS "account" (
        "id" TEXT PRIMARY KEY,
        "user_id" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
        "account_id" TEXT NOT NULL,
        "provider_id" TEXT NOT NULL,
        "access_token" TEXT,
        "refresh_token" TEXT,
        "access_token_expires_at" TIMESTAMP,
        "refresh_token_expires_at" TIMESTAMP,
        "scope" TEXT,
        "id_token" TEXT,
        "password" TEXT,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Verifications table
      CREATE TABLE IF NOT EXISTS "verification" (
        "id" TEXT PRIMARY KEY,
        "identifier" TEXT NOT NULL,
        "value" TEXT,
        "expires_at" TIMESTAMP NOT NULL,
        "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes
      CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user"("email");
      CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session"("user_id");
      CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account"("user_id");
    `);
    
    console.log('✅ Database tables created successfully!');
  } catch (error) {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupDatabase();
