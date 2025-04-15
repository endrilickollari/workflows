import { userRepository } from '../repositories/user.repository';
import { User, NewUser, UserPlan } from '../db';
import { hashPassword } from '../utils/password';

export class UserService {
  /**
   * Create a new user (admin operation)
   */
  async createUser(userData: Omit<NewUser, 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      console.log('Creating user with data:', { ...userData, password: '[REDACTED]' });
      // Check if user already exists
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash the password
      const hashedPassword = await hashPassword(userData.password);

      // Create the user with hashed password
      const newUserData = {
        ...userData,
        password: hashedPassword,
      };
      console.log('Prepared user data:', { ...newUserData, password: '[REDACTED]' });
      
      const user = await userRepository.create(newUserData);
      console.log('User created successfully:', user.id);
      return user;
    } catch (error) {
      console.error('Error creating user in service layer:', error);
      throw error;
    }
  }

  /**
   * Get all users (admin operation)
   */
  async getAllUsers(): Promise<User[]> {
    return await userRepository.findAll();
  }

  /**
   * Get user by ID (admin operation)
   */
  async getUserById(id: number): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user (admin operation)
   */
  async updateUser(
    id: number,
    userData: Partial<Omit<NewUser, 'createdAt' | 'updatedAt'>>
  ): Promise<User> {
    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // If password is being updated, hash it
    let dataToUpdate = { ...userData };
    if (userData.password) {
      dataToUpdate.password = await hashPassword(userData.password);
    }

    // Validate plan if it's being updated
    if (userData.plan && !Object.values(UserPlan).includes(userData.plan as UserPlan)) {
      throw new Error('Invalid plan type');
    }

    // Update user
    const updatedUser = await userRepository.update(id, dataToUpdate);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser;
  }

  /**
   * Delete user (admin operation)
   */
  async deleteUser(id: number): Promise<void> {
    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Delete user
    const result = await userRepository.delete(id);
    if (!result) {
      throw new Error('Failed to delete user');
    }
  }
}

// Export singleton instance
export const userService = new UserService();
