#!/bin/bash

# Generate BetterAuth schema
echo "Generating BetterAuth schema..."
bunx @better-auth/cli generate --config src/libs/auth/auth.ts

# Run migrations
echo "Running database migrations..."
bun run src/db/migrate.ts

echo "BetterAuth migration completed successfully!"