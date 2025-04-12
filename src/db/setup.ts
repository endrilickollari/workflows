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
  console.log('Step 1/3: Creating BetterAuth tables');
  const betterAuthSuccess = await runCommand(
    'bun run src/db/better-auth-migrate.ts',
    'BetterAuth migration'
  );
  if (!betterAuthSuccess) {
    console.error('Failed to create BetterAuth tables. Exiting setup.');
    process.exit(1);
  }

  // Step 2: Run drizzle migrations for main schema
  console.log('Step 2/3: Running Drizzle migrations');
  const drizzleSuccess = await runCommand('bun run db:migrate', 'Drizzle migrations');
  if (!drizzleSuccess) {
    console.error('Failed to run Drizzle migrations. Exiting setup.');
    process.exit(1);
  }

  // Step 3: Create admin user in BetterAuth if not exists
  console.log('Step 3/3: Creating admin user');
  const adminEmail = 'admin@example.com';
  const adminPassword = 'adminpassword';

  try {
    const sqlite = new Database('data.db');

    // Check if admin user exists
    const adminExists = sqlite
      .query('SELECT 1 FROM ba_users WHERE email = ? LIMIT 1')
      .get(adminEmail);

    if (!adminExists) {
      console.log('Creating admin user...');

      // Generate a UUID for the user ID
      const uuid = crypto.randomUUID();

      // Insert admin user
      sqlite.run(
        `
          INSERT INTO ba_users (id,
                                email,
                                email_verified,
                                password,
                                name,
                                first_name,
                                last_name,
                                plan,
                                is_admin)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          uuid,
          adminEmail,
          1, // email verified
          adminPassword, // In production this should be hashed
          'Admin User',
          'Admin',
          'User',
          'Premium',
          1, // is admin
        ]
      );

      console.log(`Admin user created with email: ${adminEmail} and password: ${adminPassword}`);
    } else {
      console.log('Admin user already exists');
    }

    sqlite.close();
  } catch (error) {
    console.error('Error creating admin user:', error);
  }

  console.log('\n✅ Database setup complete! You can now start the server.');
}

// Run the setup
setupDatabase();
