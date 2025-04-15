import { userService } from '../services/user.service';
import { NewUser } from '../db';
import { USER_PLANS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../utils/constants';

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
  // Removed isAdmin field
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
  // Removed isAdmin field
}

export class UserController {
  /**
   * Create a new user
   */
  async createUser(request: CreateUserRequest) {
    try {
      // Validate plan if provided
      if (request.plan && !Object.values(USER_PLANS).includes(request.plan)) {
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_PLAN,
        };
      }

      // Create required fields and cast additional ones appropriately
      // Handle empty strings for optional fields
      const userData: Omit<NewUser, 'createdAt' | 'updatedAt'> = {
        email: request.email, // Required
        password: request.password, // Required
        firstName: request.firstName || null,
        lastName: request.lastName || null,
        plan: request.plan && request.plan.trim() !== '' ? request.plan : USER_PLANS.FREE,
      };

      const newUser = await userService.createUser(userData);

      return {
        success: true,
        data: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          plan: newUser.plan,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        message: SUCCESS_MESSAGES.USER_CREATED,
      };
    } catch (error) {
      console.error('Create user error:', error); // Add debugging
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.USER_EXISTS,
      };
    }
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    try {
      const users = await userService.getAllUsers();

      return {
        success: true,
        data: users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          plan: user.plan,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        message: 'Users retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve users',
      };
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number) {
    try {
      const user = await userService.getUserById(id);

      return {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          plan: user.plan,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        message: 'User retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : ERROR_MESSAGES.USER_NOT_FOUND,
      };
    }
  }

  /**
   * Update user
   */
  async updateUser(id: number, request: UpdateUserRequest) {
    try {
      // Validate plan if provided
      if (request.plan && !Object.values(USER_PLANS).includes(request.plan)) {
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_PLAN,
        };
      }

      const userData: Partial<NewUser> = {
        email: request.email,
        password: request.password,
        firstName: request.firstName,
        lastName: request.lastName,
        plan: request.plan && request.plan.trim() !== '' ? request.plan : undefined,
      };

      // Filter out undefined properties
      Object.keys(userData).forEach(key => {
        if (userData[key as keyof typeof userData] === undefined) {
          delete userData[key as keyof typeof userData];
        }
      });

      const updatedUser = await userService.updateUser(id, userData);

      return {
        success: true,
        data: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          plan: updatedUser.plan,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
        message: SUCCESS_MESSAGES.USER_UPDATED,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user',
      };
    }
  }

  /**
   * Delete user
   */
  async deleteUser(id: number) {
    try {
      await userService.deleteUser(id);

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_DELETED,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete user',
      };
    }
  }
}

// Export singleton instance
export const userController = new UserController();