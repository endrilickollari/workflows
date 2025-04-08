import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {sql} from "drizzle-orm";

export const PLANS = {
    FREE: "free",
    PREMIUM: "premium",
    BUSINESS: "business",
}
export const users = sqliteTable("users", {
    id: text("id").primaryKey(),
    authId: text("authId").notNull().unique(),
    email: text("email").notNull(),
    name: text("name").notNull(),
    surname: text("surname"),
    country: text("country").notNull(),
    city: text('city'),
    phone: text('phone'),
    plan: text('plan').default(PLANS.FREE),
    planActivatedAt: integer('plan_activated_at', {mode: 'timestamp'}),
    planExpiresAt: integer('plan_expires_at', {mode: 'timestamp'}),
    isActive: integer('is_active', {mode: 'boolean'}).default(true),
    createdAt: integer('created_at', {mode: 'timestamp'})
        .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: integer('updated_at', {mode: 'timestamp'})
        .default(sql`CURRENT_TIMESTAMP`),
})