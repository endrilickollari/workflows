/**
 * Script to create SQL migration files for PostgreSQL
 */
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'drizzle', 'migrations');
const metaDir = path.join(outDir, 'meta');

// Ensure migrations and meta directories exist
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}
if (!fs.existsSync(metaDir)) {
  fs.mkdirSync(metaDir, { recursive: true });
}

// Create migration timestamp
const timestamp = new Date().toISOString().replace(/[-:.]/g, '').replace('T', '_').split('Z')[0];
const migrationName = `${timestamp}_better_auth_schema`;
const migrationPath = path.join(outDir, `${migrationName}.sql`);

// SQL for creating BetterAuth tables
const sql = `
-- Migration: BetterAuth Schema
-- Tables for BetterAuth authentication using PostgreSQL

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

-- Create indexes for common lookup patterns
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user"("email");
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session"("user_id");
CREATE INDEX IF NOT EXISTS "session_token_idx" ON "session"("token");
CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account"("user_id");
CREATE INDEX IF NOT EXISTS "account_provider_account_idx" ON "account"("provider_id", "account_id");
`;

// Write migration file
fs.writeFileSync(migrationPath, sql);

// Create or update _journal.json file
const journalPath = path.join(metaDir, '_journal.json');
const journalContent = {
  "version": "5",
  "dialect": "pg",
  "entries": [
    {
      "idx": 0,
      "version": "5",
      "when": new Date().toISOString(),
      "tag": "better_auth_schema",
      "breakpoints": true
    }
  ]
};

// Write journal file
fs.writeFileSync(journalPath, JSON.stringify(journalContent, null, 2));

console.log(`✅ Migration created: ${migrationPath}`);
console.log(`✅ Journal file created: ${journalPath}`);
console.log('Next step: Apply migration with "bun run db:migrate"');
