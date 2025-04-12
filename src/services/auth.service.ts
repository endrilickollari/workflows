import { userRepository } from '../repositories/user.repository';
import { NewUser } from '../db';
import { hashPassword, comparePasswords } from '../utils/password';

export class AuthService {
  /**
   * Register a new user
   */
  async signup(
    userData: Omit<NewUser, 'isAdmin' | 'createdAt' | 'updatedAt'>
  ): Promise<{ id: number; email: string }> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await hashPassword(userData.password);

    // Create the user with hashed password
    const newUser = await userRepository.create({
      ...userData,
      password: hashedPassword,
      isAdmin: false, // Regular users can't be admins by default
    });

    return {
      id: newUser.id,
      email: newUser.email,
    };
  }

  /**
   * Authenticate a user
   */
  async login(
    email: string,
    password: string
  ): Promise<{ id: number; email: string; plan: string; isAdmin: boolean } | null> {
    // Find the user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    // Verify password
    const isValidPassword = await comparePasswords(password, user.password);
    if (!isValidPassword) {
      return null;
    }

    // Return user info (excluding sensitive data)
    return {
      id: user.id,
      email: user.email,
      plan: user.plan,
      isAdmin: user.isAdmin,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
