import type {
  TwoFactorDisableRequest,
  TwoFactorDisableResponse,
  TwoFactorEnrollResponse,
  TwoFactorRecoveryCodesResponse,
  TwoFactorStatus,
  TwoFactorVerifyRequest,
  TwoFactorVerifyResponse,
} from "./types";
import {
  mockTwoFactorDisable,
  mockTwoFactorEnroll,
  mockTwoFactorRecovery,
  mockTwoFactorStatus,
  mockTwoFactorVerify,
} from "./mock";

const isMockEnabled = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const requestJson = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
};

export const getStatus = async (): Promise<TwoFactorStatus> => {
  if (isMockEnabled) {
    return mockTwoFactorStatus();
  }

  return requestJson<TwoFactorStatus>("/api/auth/2fa/status", {
    method: "GET",
  });
};

export const startEnrollment = async (): Promise<TwoFactorEnrollResponse> => {
  if (isMockEnabled) {
    return mockTwoFactorEnroll();
  }

  return requestJson<TwoFactorEnrollResponse>("/api/auth/2fa/enroll", {
    method: "POST",
  });
};

export const verifyEnrollment = async (
  payload: TwoFactorVerifyRequest
): Promise<TwoFactorVerifyResponse> => {
  if (isMockEnabled) {
    return mockTwoFactorVerify();
  }

  return requestJson<TwoFactorVerifyResponse>("/api/auth/2fa/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const disableTwoFactor = async (
  payload: TwoFactorDisableRequest
): Promise<TwoFactorDisableResponse> => {
  if (isMockEnabled) {
    return mockTwoFactorDisable();
  }

  return requestJson<TwoFactorDisableResponse>("/api/auth/2fa/disable", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const regenerateRecoveryCodes =
  async (): Promise<TwoFactorRecoveryCodesResponse> => {
    if (isMockEnabled) {
      return mockTwoFactorRecovery();
    }

    return requestJson<TwoFactorRecoveryCodesResponse>("/api/auth/2fa/recovery", {
      method: "POST",
    });
  };
