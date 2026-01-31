import { AuthResult } from "./types";

const MOCK_DELAY = 800;

const VALID_CREDENTIALS = {
  email: "user@test.com",
  password: "password123",
};

const EXISTING_EMAIL = "existing@test.com";

const simulateDelay = () =>
  new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

export const mockLogin = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  await simulateDelay();

  if (
    email === VALID_CREDENTIALS.email &&
    password === VALID_CREDENTIALS.password
  ) {
    return {
      success: true,
      user: {
        email,
        name: "Test User",
      },
    };
  }

  return {
    success: false,
    error: "Invalid email or password",
  };
};

export const mockSignup = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResult> => {
  await simulateDelay();

  if (email === EXISTING_EMAIL) {
    return {
      success: false,
      error: "An account with this email already exists",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters",
    };
  }

  return {
    success: true,
    user: {
      email,
      name: name || email.split("@")[0],
    },
  };
};

export const mockLogout = async (): Promise<AuthResult> => {
  await simulateDelay();
  return {
    success: true,
  };
};
