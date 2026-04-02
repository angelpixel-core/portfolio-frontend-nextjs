import type {
  TwoFactorDisableRequest,
  TwoFactorDisableResponse,
  TwoFactorEnrollRequest,
  TwoFactorEnrollResponse,
  TwoFactorRecoveryCodesRequest,
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
import { authClient } from "@/lib/auth-client";

const isMockEnabled = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

const createPlaceholderQrCodeDataUrl = (otpauthUrl: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
  <rect width="220" height="220" fill="#f5f5f5" />
  <rect x="20" y="20" width="180" height="180" fill="#ffffff" stroke="#1b1b1b" stroke-width="2" />
  <text x="110" y="110" font-family="Arial" font-size="10" text-anchor="middle" fill="#1b1b1b">
    Scan in authenticator app
  </text>
  <text x="110" y="130" font-family="Arial" font-size="6" text-anchor="middle" fill="#6b6b6b">
    ${otpauthUrl}
  </text>
</svg>`;

  const encoded =
    typeof window === "undefined"
      ? Buffer.from(svg).toString("base64")
      : window.btoa(unescape(encodeURIComponent(svg)));

  return `data:image/svg+xml;base64,${encoded}`;
};

export const getStatus = async (): Promise<TwoFactorStatus> => {
  if (isMockEnabled) {
    return mockTwoFactorStatus();
  }

  const session = await authClient.getSession();
  const user = session?.data?.user ?? null;

  return {
    enabled: Boolean(user?.twoFactorEnabled),
  };
};

export const startEnrollment = async (
  payload: TwoFactorEnrollRequest
): Promise<TwoFactorEnrollResponse> => {
  if (isMockEnabled) {
    return mockTwoFactorEnroll(payload);
  }

  const { data, error } = await authClient.twoFactor.enable({
    password: payload.password,
    issuer: payload.issuer,
  });

  if (error || !data?.totpURI) {
    throw new Error(error?.message || "Enrollment failed");
  }

  return {
    otpauthUrl: data.totpURI,
    qrCodeDataUrl: createPlaceholderQrCodeDataUrl(data.totpURI),
    recoveryCodes: data.backupCodes ?? [],
  };
};

export const verifyEnrollment = async (
  payload: TwoFactorVerifyRequest
): Promise<TwoFactorVerifyResponse> => {
  if (isMockEnabled) {
    return mockTwoFactorVerify();
  }

  const { error } = await authClient.twoFactor.verifyTotp({
    code: payload.code,
    trustDevice: payload.trustDevice,
  });

  if (error) {
    throw new Error(error.message || "Verification failed");
  }

  return {
    enabled: true,
  };
};

export const disableTwoFactor = async (
  payload: TwoFactorDisableRequest
): Promise<TwoFactorDisableResponse> => {
  if (isMockEnabled) {
    return mockTwoFactorDisable(payload);
  }

  const { error } = await authClient.twoFactor.disable({
    password: payload.password,
  });

  if (error) {
    throw new Error(error.message || "Disable failed");
  }

  return {
    enabled: false,
  };
};

export const regenerateRecoveryCodes =
  async (
    payload: TwoFactorRecoveryCodesRequest
  ): Promise<TwoFactorRecoveryCodesResponse> => {
    if (isMockEnabled) {
      return mockTwoFactorRecovery(payload);
    }

    const { data, error } = await authClient.twoFactor.generateBackupCodes({
      password: payload.password,
    });

    if (error || !data?.backupCodes) {
      throw new Error(error?.message || "Unable to regenerate codes");
    }

    return { recoveryCodes: data.backupCodes };
  };
