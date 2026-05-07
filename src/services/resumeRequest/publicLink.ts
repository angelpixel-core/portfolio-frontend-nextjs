import { createHash, randomBytes } from "crypto";

export const DEFAULT_TTL_DAYS = 7;
export const MIN_TTL_DAYS = 1;
export const MAX_TTL_DAYS = 30;

export const createResumeRequestToken = (): string => {
  return randomBytes(32).toString("base64url");
};

export const hashResumeRequestToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const getResumeRequestPublicBaseUrl = (): string => {
  return (
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
};

export const getResumeRequestLinkState = (
  input: {
    usedAt?: Date | null;
    revokedAt?: Date | null;
    expiresAt: Date;
  },
  now = new Date()
): "active" | "used" | "revoked" | "expired" => {
  if (input.usedAt) return "used";
  if (input.revokedAt) return "revoked";
  if (input.expiresAt <= now) return "expired";
  return "active";
};
