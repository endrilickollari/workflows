/**
 * Script to apply database migrations using Drizzle
 */
import { execSync } from 'child_process';

console.log('🔄 Running database migrations...');

try {
  // Generate migration SQL from schema changes
  console.log('Generating migration SQL...');
  execSync('bun drizzle-kit generate:pg --schema=./src/libs/auth/schema.ts', {
    stdio: 'inherit'
  });
  
  // Apply migrations to the database
  console.log('\nApplying migrations...');
  execSync('bun run drizzle:migrate', {
    stdio: 'inherit'
  });
  
  console.log('\n✅ Migrations completed successfully!');
} catch (error) {
  console.error('\n❌ Migration failed:', error);
  process.exit(1);
}
