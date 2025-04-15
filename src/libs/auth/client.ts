import { createAuthClient } from "better-auth/client";

// Create the authentication client
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000/api/auth'
});

// Example signin functions
export const signinWithEmail = async (email: string, password: string) => {
  return await authClient.signIn.email({
    email,
    password
  });
};

export const signinWithGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
  
  return data;
};

export const signinWithGithub = async () => {
  const data = await authClient.signIn.social({
    provider: "github",
  });
  
  return data;
};

export const signup = async (email: string, password: string, name: string) => {
  return await authClient.signUp.email({
    email,
    password,
    name
  });
};

export const signout = async () => {
  return await authClient.signOut();
};

export const getSession = async () => {
  return await authClient.getSession();
};
