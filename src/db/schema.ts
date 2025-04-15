import { sql } from 'drizzle-orm';
import { text, integer, sqliteTable } from 'drizzle-orm/sqlite-core';

// Define the user plans as an enum
export const UserPlan = {
  FREE: 'Free',
  BASIC: 'Basic',
  PREMIUM: 'Premium',
} as const;
export type UserPlan = (typeof UserPlan)[keyof typeof UserPlan];

// User table schema - removed isAdmin
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Note: should be hashed in the implementation
  firstName: text('first_name'),
  lastName: text('last_name'),
  plan: text('plan', { enum: Object.values(UserPlan) as [string, ...string[]] })
    .notNull()
    .default(UserPlan.FREE),
  // Removed isAdmin field
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

// Export types for the schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
