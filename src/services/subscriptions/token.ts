import { createHmac, timingSafeEqual } from "crypto";

type TokenPurpose = "confirm" | "unsubscribe";

type TokenPayload = {
  sid: string;
  email: string;
  purpose: TokenPurpose;
  exp: number;
};

type BuildTokenInput = {
  subscriptionId: string;
  email: string;
  purpose: TokenPurpose;
  expiresInSeconds: number;
};

type ValidateResult =
  | { ok: true; payload: TokenPayload }
  | {
      ok: false;
      reason: "missing_secret" | "invalid" | "expired" | "purpose_mismatch";
    };

const getTokenSecret = (): string | null => {
  return (
    process.env.SUBSCRIBE_TOKEN_SECRET ?? process.env.BETTER_AUTH_SECRET ?? null
  );
};

const toBase64Url = (value: string): string => {
  return Buffer.from(value, "utf8").toString("base64url");
};

const fromBase64Url = (value: string): string | null => {
  try {
    return Buffer.from(value, "base64url").toString("utf8");
  } catch {
    return null;
  }
};

const signPayload = (encodedPayload: string, secret: string): string => {
  return createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
};

export const buildSubscriptionToken = (
  input: BuildTokenInput
): string | null => {
  const secret = getTokenSecret();
  if (!secret) {
    return null;
  }

  const payload: TokenPayload = {
    sid: input.subscriptionId,
    email: input.email.trim().toLowerCase(),
    purpose: input.purpose,
    exp: Math.floor(Date.now() / 1000) + Math.max(1, input.expiresInSeconds),
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = signPayload(encodedPayload, secret);

  return `${encodedPayload}.${signature}`;
};

export const validateSubscriptionToken = (
  token: string,
  expectedPurpose: TokenPurpose
): ValidateResult => {
  const secret = getTokenSecret();
  if (!secret) {
    return { ok: false, reason: "missing_secret" };
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return { ok: false, reason: "invalid" };
  }

  const encodedPayload = parts[0] ?? "";
  const receivedSignature = parts[1] ?? "";
  if (!encodedPayload || !receivedSignature) {
    return { ok: false, reason: "invalid" };
  }

  const expectedSignature = signPayload(encodedPayload, secret);
  const signatureMatches = (() => {
    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(receivedSignature);
    if (expectedBuffer.length !== receivedBuffer.length) {
      return false;
    }

    return timingSafeEqual(expectedBuffer, receivedBuffer);
  })();

  if (!signatureMatches) {
    return { ok: false, reason: "invalid" };
  }

  const json = fromBase64Url(encodedPayload);
  if (!json) {
    return { ok: false, reason: "invalid" };
  }

  let payload: TokenPayload;
  try {
    payload = JSON.parse(json) as TokenPayload;
  } catch {
    return { ok: false, reason: "invalid" };
  }

  if (
    !payload ||
    typeof payload.sid !== "string" ||
    typeof payload.email !== "string" ||
    typeof payload.purpose !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return { ok: false, reason: "invalid" };
  }

  if (payload.purpose !== expectedPurpose) {
    return { ok: false, reason: "purpose_mismatch" };
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now) {
    return { ok: false, reason: "expired" };
  }

  return {
    ok: true,
    payload: {
      ...payload,
      email: payload.email.trim().toLowerCase(),
    },
  };
};
