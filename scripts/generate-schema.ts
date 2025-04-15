/**
 * Script to generate BetterAuth schema for Drizzle
 */
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

console.log('🔄 Generating BetterAuth schema for Drizzle...');

try {
  // Ensure output directory exists
  const schemaDir = path.join(process.cwd(), 'drizzle');
  if (!fs.existsSync(schemaDir)) {
    fs.mkdirSync(schemaDir, { recursive: true });
  }

  // Set environment variables to influence the schema generation
  process.env.BETTER_AUTH_ADAPTER = 'drizzle';
  process.env.BETTER_AUTH_DB_PROVIDER = 'pg';
  
  // Run the BetterAuth CLI generate command
  const command = 'npx @better-auth/cli generate';
  console.log(`Executing: ${command}`);
  
  const output = execSync(command, { 
    encoding: 'utf-8',
    env: { 
      ...process.env,
      BETTER_AUTH_ADAPTER: 'drizzle',
      BETTER_AUTH_DB_PROVIDER: 'pg'
    }
  });
  console.log(output);
  
  console.log('✅ Schema generated successfully!');
  console.log('Next step: Run migrations with "bun run db:migrate"');
} catch (error) {
  console.error('❌ Failed to generate schema:', error);
  
  // Fallback: Create schema directly
  console.log('Attempting to generate schema directly...');
  try {
    const schemaContent = `
import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users table - match BetterAuth's standard schema
export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Sessions table - match BetterAuth's standard schema
export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Accounts table - match BetterAuth's standard schema
export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// Verifications table - match BetterAuth's standard schema
export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});`;

    // Write schema directly to the libs/auth/schema.ts file
    fs.writeFileSync(path.join(process.cwd(), 'src', 'libs', 'auth', 'schema.ts'), schemaContent);
    console.log('✅ Schema created directly.');
  } catch (fallbackError) {
    console.error('❌ Fallback also failed:', fallbackError);
    process.exit(1);
  }
}
