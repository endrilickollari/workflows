import { createAuthClient } from "better-auth/client";

// Create the authentication client
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000/api/auth'
});

// Email sign up function
export const signup = async (email: string, password: string, name: string, image?: string) => {
  return await authClient.signUp.email({
    email,
    password,
    name,
    image,
  });
};

// Email sign in function
export const signinWithEmail = async (email: string, password: string, rememberMe = true, callbackURL?: string) => {
  return await authClient.signIn.email({
    email,
    password,
    rememberMe,
    callbackURL,
  });
};

// Google sign in function
export const signinWithGoogle = async (callbackURL?: string, disableRedirect?: boolean) => {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL,
    disableRedirect,
  });
};

// GitHub sign in function
export const signinWithGithub = async (callbackURL?: string, disableRedirect?: boolean) => {
  return await authClient.signIn.social({
    provider: "github",
    callbackURL,
    disableRedirect,
  });
};

// Sign out function
export const signout = async (onSuccessRedirect?: string) => {
  return await authClient.signOut(onSuccessRedirect ? {
    fetchOptions: {
      onSuccess: () => {
        window.location.href = onSuccessRedirect;
      }
    }
  } : undefined);
};

// Get current session
export const getSession = async () => {
  return await authClient.getSession();
};

// Send password reset email
export const forgotPassword = async (email: string, redirectTo: string) => {
  return await authClient.forgetPassword({
    email,
    redirectTo,
  });
};

// Reset password with token
export const resetPassword = async (newPassword: string, token: string) => {
  return await authClient.resetPassword({
    newPassword,
    token,
  });
};

// Send email verification
export const sendVerificationEmail = async (email: string, callbackURL: string) => {
  return await authClient.sendVerificationEmail({
    email,
    callbackURL,
  });
};
