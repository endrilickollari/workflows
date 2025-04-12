import { authService } from '../services/auth.service';
import { NewUser } from '../db';

export interface SignupRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  plan?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export class AuthController {
  /**
   * Handle user signup
   */
  async signup(request: SignupRequest) {
    try {
      const userData: Partial<NewUser> = {
        email: request.email,
        password: request.password,
        firstName: request.firstName,
        lastName: request.lastName,
        plan: request.plan,
      };

      const newUser = await authService.signup(userData);

      return {
        success: true,
        data: newUser,
        message: 'User registered successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to register user',
      };
    }
  }

  /**
   * Handle user login
   */
  async login(request: LoginRequest, generateToken: (payload: object) => string) {
    try {
      const user = await authService.login(request.email, request.password);

      if (!user) {
        return {
          success: false,
          message: 'Invalid email or password',
        };
      }

      // Generate JWT token for authenticated user
      const token = generateToken({
        id: user.id,
        email: user.email,
        plan: user.plan,
        isAdmin: user.isAdmin,
      });

      return {
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            plan: user.plan,
          },
        },
        message: 'Login successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
      };
    }
  }
}

// Export singleton instance
export const authController = new AuthController();
