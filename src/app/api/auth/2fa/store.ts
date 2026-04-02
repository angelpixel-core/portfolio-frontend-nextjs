import {
  createOtpAuthUrl,
  generateRecoveryCodes,
  generateTotpSecret,
  getTwoFactorIssuer,
  verifyTotpCode,
} from "@/lib/two-factor";

export interface TwoFactorStatus {
  enabled: boolean;
  enrolledAt?: string;
  lastVerifiedAt?: string;
}

export interface TwoFactorEnrollResult {
  otpauthUrl: string;
  qrCodeDataUrl: string;
  recoveryCodes: string[];
}

export interface TwoFactorVerifyResult extends TwoFactorStatus {
  recoveryCodes?: string[];
}

export interface TwoFactorRecoveryResult {
  recoveryCodes: string[];
}

export class TwoFactorError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

interface TwoFactorRecord {
  enabled: boolean;
  enrolledAt?: string;
  lastVerifiedAt?: string;
  pendingSecret?: string;
  secret?: string;
  recoveryCodes?: string[];
  recoveryCodesShown?: boolean;
}

const records = new Map<string, TwoFactorRecord>();

const nowIso = (): string => new Date().toISOString();

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

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
};

export const getTwoFactorStatus = (userKey: string): TwoFactorStatus => {
  const record = records.get(userKey);
  return {
    enabled: record?.enabled ?? false,
    enrolledAt: record?.enrolledAt,
    lastVerifiedAt: record?.lastVerifiedAt,
  };
};

export const startTwoFactorEnrollment = (
  userKey: string,
  label: string
): TwoFactorEnrollResult => {
  const record = records.get(userKey);
  if (record?.enabled) {
    throw new TwoFactorError(
      "Two-factor authentication already enabled",
      409,
      "two_factor_already_enabled"
    );
  }

  const secret = generateTotpSecret();
  const otpauthUrl = createOtpAuthUrl({
    secret,
    label,
    issuer: getTwoFactorIssuer(),
  });
  const recoveryCodes = generateRecoveryCodes();

  records.set(userKey, {
    ...record,
    enabled: false,
    pendingSecret: secret,
    recoveryCodes,
    recoveryCodesShown: true,
  });

  return {
    otpauthUrl,
    qrCodeDataUrl: createPlaceholderQrCodeDataUrl(otpauthUrl),
    recoveryCodes,
  };
};

export const verifyTwoFactorEnrollment = (
  userKey: string,
  code: string
): TwoFactorVerifyResult => {
  const record = records.get(userKey);
  if (!record?.pendingSecret) {
    throw new TwoFactorError(
      "No pending 2FA enrollment",
      400,
      "no_pending_enrollment"
    );
  }

  if (!verifyTotpCode(code, record.pendingSecret)) {
    throw new TwoFactorError("Invalid verification code", 400, "invalid_code");
  }

  const now = nowIso();
  const recoveryCodes = record.recoveryCodesShown
    ? undefined
    : record.recoveryCodes;

  records.set(userKey, {
    ...record,
    enabled: true,
    secret: record.pendingSecret,
    pendingSecret: undefined,
    enrolledAt: record.enrolledAt ?? now,
    lastVerifiedAt: now,
    recoveryCodesShown: record.recoveryCodesShown ?? true,
  });

  return {
    enabled: true,
    enrolledAt: record.enrolledAt ?? now,
    lastVerifiedAt: now,
    recoveryCodes,
  };
};

export const disableTwoFactor = (
  userKey: string,
  code: string
): TwoFactorStatus => {
  const record = records.get(userKey);
  if (!record?.enabled || !record.secret) {
    throw new TwoFactorError("Two-factor not enabled", 400, "not_enabled");
  }

  if (!verifyTotpCode(code, record.secret)) {
    throw new TwoFactorError("Invalid verification code", 400, "invalid_code");
  }

  records.set(userKey, {
    enabled: false,
  });

  return {
    enabled: false,
  };
};

export const regenerateRecoveryCodes = (
  userKey: string
): TwoFactorRecoveryResult => {
  const record = records.get(userKey);
  if (!record?.enabled) {
    throw new TwoFactorError("Two-factor not enabled", 400, "not_enabled");
  }

  const recoveryCodes = generateRecoveryCodes();
  records.set(userKey, {
    ...record,
    recoveryCodes,
    recoveryCodesShown: true,
  });

  return { recoveryCodes };
};
