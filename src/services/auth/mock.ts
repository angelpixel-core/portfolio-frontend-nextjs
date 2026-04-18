import {
  AuthResult,
  OAuthProvider,
  TwoFactorDisableResponse,
  TwoFactorEnrollRequest,
  TwoFactorEnrollResponse,
  TwoFactorRecoveryCodesResponse,
  TwoFactorRecoveryCodesRequest,
  TwoFactorStatus,
  TwoFactorVerifyResponse,
} from "./types";
import {
  twoFactorEnrollMock,
  twoFactorRecoveryCodesMock,
  twoFactorStatusMock,
} from "@/domains/two-factor/model/mock";

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

const OAUTH_DELAY = 1200;

const OAUTH_MOCK_USERS: Record<OAuthProvider, { email: string; name: string }> =
  {
    github: { email: "john.doe@users.noreply.github.com", name: "John Doe" },
    google: { email: "john.doe@gmail.com", name: "John Doe" },
    linkedin: { email: "john.doe@linkedin.com", name: "John Doe" },
    microsoft: { email: "john.doe@outlook.com", name: "John Doe" },
  };

export const mockOAuthLogin = async (
  provider: OAuthProvider
): Promise<AuthResult> => {
  await new Promise((resolve) => setTimeout(resolve, OAUTH_DELAY));

  const mockUser = OAUTH_MOCK_USERS[provider];
  if (!mockUser) {
    return {
      success: false,
      error: "Unsupported provider",
    };
  }

  return {
    success: true,
    user: mockUser,
  };
};

export const mockTwoFactorStatus = async (): Promise<TwoFactorStatus> => {
  await simulateDelay();
  return { ...twoFactorStatusMock };
};

export const mockTwoFactorEnroll = async (
  _payload?: TwoFactorEnrollRequest
): Promise<TwoFactorEnrollResponse> => {
  await simulateDelay();
  return { ...twoFactorEnrollMock };
};

export const mockTwoFactorVerify =
  async (): Promise<TwoFactorVerifyResponse> => {
    await simulateDelay();
    const now = new Date().toISOString();
    return {
      enabled: true,
      enrolledAt: now,
      lastVerifiedAt: now,
      recoveryCodes: [...twoFactorRecoveryCodesMock],
    };
  };

export const mockTwoFactorDisable = async (_payload?: {
  password: string;
}): Promise<TwoFactorDisableResponse> => {
  await simulateDelay();
  return { enabled: false };
};

export const mockTwoFactorRecovery = async (
  _payload?: TwoFactorRecoveryCodesRequest
): Promise<TwoFactorRecoveryCodesResponse> => {
  await simulateDelay();
  return { recoveryCodes: [...twoFactorRecoveryCodesMock] };
};
