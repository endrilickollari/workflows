import { userService } from "../services/user.service";
import { NewUser } from "../db";

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
  isAdmin?: boolean;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
  isAdmin?: boolean;
}

export class UserController {
  /**
   * Create a new user (admin operation)
   */
  async createUser(request: CreateUserRequest) {
    try {
      const userData: Partial<NewUser> = {
        email: request.email,
        password: request.password,
        firstName: request.firstName,
        lastName: request.lastName,
        plan: request.plan,
        isAdmin: request.isAdmin || false,
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
          isAdmin: newUser.isAdmin,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        message: "User created successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create user",
      };
    }
  }

  /**
   * Get all users (admin operation)
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
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
        message: "Users retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to retrieve users",
      };
    }
  }

  /**
   * Get user by ID (admin operation)
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
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        message: "User retrieved successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to retrieve user",
      };
    }
  }

  /**
   * Update user (admin operation)
   */
  async updateUser(id: number, request: UpdateUserRequest) {
    try {
      const userData: Partial<NewUser> = {
        email: request.email,
        password: request.password,
        firstName: request.firstName,
        lastName: request.lastName,
        plan: request.plan,
        isAdmin: request.isAdmin,
      };

      // Remove undefined properties
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
          isAdmin: updatedUser.isAdmin,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
        message: "User updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update user",
      };
    }
  }

  /**
   * Delete user (admin operation)
   */
  async deleteUser(id: number) {
    try {
      await userService.deleteUser(id);
      
      return {
        success: true,
        message: "User deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete user",
      };
    }
  }
}

// Export singleton instance
export const userController = new UserController();