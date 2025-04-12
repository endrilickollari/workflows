import { Database } from 'bun:sqlite';

console.log('Creating BetterAuth tables in SQLite...');

// Create the database if it doesn't exist
const sqlite = new Database('data.db');

// Create the BetterAuth tables manually
const createTables = async () => {
  try {
    // Check if tables already exist
    const tablesExist = sqlite
      .query("SELECT name FROM sqlite_master WHERE type='table' AND name='ba_users'")
      .get();

    if (tablesExist) {
      console.log('BetterAuth tables already exist');
      return;
    }

    // Create users table
    sqlite.run(`
        CREATE TABLE IF NOT EXISTS ba_users
        (
            id
            TEXT
            PRIMARY
            KEY,
            email
            TEXT
            NOT
            NULL
            UNIQUE,
            email_verified
            INTEGER
            DEFAULT
            0,
            password
            TEXT,
            name
            TEXT,
            first_name
            TEXT,
            last_name
            TEXT,
            plan
            TEXT
            DEFAULT
            'Free',
            is_admin
            INTEGER
            DEFAULT
            0,
            image
            TEXT,
            created_at
            TEXT
            DEFAULT
            CURRENT_TIMESTAMP,
            updated_at
            TEXT
            DEFAULT
            CURRENT_TIMESTAMP
        )
    `);
    console.log('Created ba_users table');

    // Create sessions table
    sqlite.run(`
        CREATE TABLE IF NOT EXISTS ba_sessions
        (
            id
            TEXT
            PRIMARY
            KEY,
            user_id
            TEXT
            NOT
            NULL,
            expires_at
            INTEGER
            NOT
            NULL,
            created_at
            TEXT
            DEFAULT
            CURRENT_TIMESTAMP
        )
    `);
    console.log('Created ba_sessions table');

    // Create accounts table
    sqlite.run(`
        CREATE TABLE IF NOT EXISTS ba_accounts
        (
            id
            TEXT
            PRIMARY
            KEY,
            user_id
            TEXT
            NOT
            NULL,
            provider
            TEXT
            NOT
            NULL,
            provider_account_id
            TEXT
            NOT
            NULL,
            refresh_token
            TEXT,
            access_token
            TEXT,
            expires_at
            INTEGER,
            token_type
            TEXT,
            scope
            TEXT,
            id_token
            TEXT,
            created_at
            TEXT
            DEFAULT
            CURRENT_TIMESTAMP,
            updated_at
            TEXT
            DEFAULT
            CURRENT_TIMESTAMP,
            UNIQUE
        (
            provider,
            provider_account_id
        )
            )
    `);
    console.log('Created ba_accounts table');

    // Create verifications table
    sqlite.run(`
        CREATE TABLE IF NOT EXISTS ba_verifications
        (
            id
            TEXT
            PRIMARY
            KEY,
            user_id
            TEXT,
            token
            TEXT
            NOT
            NULL,
            expires
            INTEGER
            NOT
            NULL,
            identifier
            TEXT
            NOT
            NULL,
            value
            TEXT,
            created_at
            TEXT
            DEFAULT
            CURRENT_TIMESTAMP
        )
    `);
    console.log('Created ba_verifications table');

    console.log('BetterAuth tables created successfully!');
  } catch (error) {
    console.error('Error creating BetterAuth tables:', error);
  } finally {
    sqlite.close();
  }
};

// Run the migration
createTables().then(r => console.log(r));
