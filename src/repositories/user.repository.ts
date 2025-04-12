import { eq } from 'drizzle-orm';
import { db, users, User, NewUser } from '../db';

export class UserRepository {
  /**
   * Create a new user
   */
  async create(userData: NewUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }

  /**
   * Find a user by ID
   */
  async findById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  /**
   * Get all users
   */
  async findAll(): Promise<User[]> {
    return await db.select().from(users);
  }

  /**
   * Update a user
   */
  async update(id: number, userData: Partial<NewUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  /**
   * Delete a user
   */
  async delete(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowsAffected > 0;
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
