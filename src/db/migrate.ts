import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import * as schema from "./schema";

console.log("Running migrations...");

// Create the database if it doesn't exist
const sqlite = new Database("data.db");
const db = drizzle(sqlite, { schema });

// Run migrations from the migrations folder
migrate(db, { migrationsFolder: "./src/db/migrations" });

console.log("Migrations completed successfully!");

// Optionally seed the database with an admin user
const adminExists = sqlite.query("SELECT 1 FROM users WHERE email = 'admin@example.com' LIMIT 1").get();

if (!adminExists) {
  console.log("Creating admin user...");
  // In a real app, you would hash this password properly
  const seedAdmin = `
  INSERT INTO users (email, password, first_name, last_name, plan, is_admin)
  VALUES ('admin@example.com', 'adminpassword', 'Admin', 'User', 'Premium', 1);
  `;
  
  try {
    sqlite.exec(seedAdmin);
    console.log("Admin user created with email: admin@example.com and password: adminpassword");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
} else {
  console.log("Admin user already exists");
}

// Close the database connection
sqlite.close();