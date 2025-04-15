/**
 * Run all migrations and setup the database
 */
import { exec } from 'child_process';
import { promisify } from 'util';
import { Database } from 'bun:sqlite';

const execAsync = promisify(exec);

// Function to run a command and log its output
async function runCommand(command: string, name: string) {
  console.log(`Running ${name}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`${name} completed successfully.\n`);
    return true;
  } catch (error) {
    console.error(`${name} failed:`, error);
    return false;
  }
}

// Main setup function
async function setupDatabase() {
  console.log('🏗️  Setting up database...\n');

  // Step 1: Create BetterAuth tables
  console.log('Step 1/2: Creating BetterAuth tables');
  const betterAuthSuccess = await runCommand(
    'bun run src/db/better-auth-migrate.ts',
    'BetterAuth migration'
  );
  if (!betterAuthSuccess) {
    console.error('Failed to create BetterAuth tables. Exiting setup.');
    process.exit(1);
  }

  // Step 2: Run drizzle migrations for main schema
  console.log('Step 2/2: Running Drizzle migrations');
  const drizzleSuccess = await runCommand('bun run db:migrate', 'Drizzle migrations');
  if (!drizzleSuccess) {
    console.error('Failed to run Drizzle migrations. Exiting setup.');
    process.exit(1);
  }

  console.log('\n✅ Database setup complete! You can now start the server.');
}

// Run the setup
setupDatabase();
