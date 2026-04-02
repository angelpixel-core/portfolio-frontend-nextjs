import crypto from "crypto";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const DEFAULT_ISSUER = process.env.TWO_FACTOR_ISSUER ?? "Angel Solutions";
const ENCRYPTION_KEY = process.env.TWO_FACTOR_ENCRYPTION_KEY ?? "";
const RECOVERY_PEPPER = process.env.TWO_FACTOR_RECOVERY_PEPPER ?? "";

export interface TotpCodeOptions {
  timestamp?: number;
  step?: number;
  digits?: number;
}

export interface TotpVerifyOptions extends TotpCodeOptions {
  window?: number;
}

export interface OtpAuthUrlOptions {
  secret: string;
  label: string;
  issuer?: string;
}

const getEncryptionKey = (): Buffer => {
  if (!ENCRYPTION_KEY) {
    throw new Error("TWO_FACTOR_ENCRYPTION_KEY is required");
  }

  const key = Buffer.from(ENCRYPTION_KEY, "base64");
  if (key.length !== 32) {
    throw new Error("TWO_FACTOR_ENCRYPTION_KEY must be 32 bytes (base64)");
  }

  return key;
};

const getRecoveryPepper = (): string => {
  if (!RECOVERY_PEPPER) {
    throw new Error("TWO_FACTOR_RECOVERY_PEPPER is required");
  }

  return RECOVERY_PEPPER;
};

const base32Encode = (buffer: Buffer): string => {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
};

const base32Decode = (input: string): Buffer => {
  let bits = 0;
  let value = 0;
  const output: number[] = [];
  const sanitized = input.replace(/=+$/g, "").toUpperCase();

  for (const char of sanitized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      continue;
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(output);
};

const buildCounterBuffer = (counter: number): Buffer => {
  const buffer = Buffer.alloc(8);
  const high = Math.floor(counter / 0x100000000);
  const low = counter >>> 0;

  buffer.writeUInt32BE(high, 0);
  buffer.writeUInt32BE(low, 4);

  return buffer;
};

export const getTwoFactorIssuer = (): string => DEFAULT_ISSUER;

export const generateTotpSecret = (length = 20): string =>
  base32Encode(crypto.randomBytes(length));

export const createOtpAuthUrl = ({
  secret,
  label,
  issuer = getTwoFactorIssuer(),
}: OtpAuthUrlOptions): string => {
  const encodedLabel = encodeURIComponent(`${issuer}:${label}`);
  const encodedIssuer = encodeURIComponent(issuer);

  return `otpauth://totp/${encodedLabel}?secret=${secret}&issuer=${encodedIssuer}`;
};

export const generateTotpCode = (
  secret: string,
  { timestamp = Date.now(), step = 30, digits = 6 }: TotpCodeOptions = {}
): string => {
  const counter = Math.floor(timestamp / 1000 / step);
  const key = base32Decode(secret);
  const hmac = crypto
    .createHmac("sha1", key)
    .update(buildCounterBuffer(counter))
    .digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  return (code % 10 ** digits).toString().padStart(digits, "0");
};

export const verifyTotpCode = (
  code: string,
  secret: string,
  {
    timestamp = Date.now(),
    step = 30,
    digits = 6,
    window = 1,
  }: TotpVerifyOptions = {}
): boolean => {
  const time = Math.floor(timestamp / 1000 / step);

  for (let offset = -window; offset <= window; offset += 1) {
    const candidate = generateTotpCode(secret, {
      timestamp: (time + offset) * step * 1000,
      step,
      digits,
    });

    if (candidate === code) {
      return true;
    }
  }

  return false;
};

export const encryptTwoFactorSecret = (secret: string): string => {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(secret, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("base64")}.${tag.toString("base64")}.${ciphertext.toString(
    "base64"
  )}`;
};

export const decryptTwoFactorSecret = (payload: string): string => {
  const [ivPart, tagPart, cipherPart] = payload.split(".");
  if (!ivPart || !tagPart || !cipherPart) {
    throw new Error("Invalid encrypted secret payload");
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivPart, "base64");
  const tag = Buffer.from(tagPart, "base64");
  const ciphertext = Buffer.from(cipherPart, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

  decipher.setAuthTag(tag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
};

export const generateRecoveryCodes = (count = 10, length = 10): string[] => {
  const codes: string[] = [];

  for (let index = 0; index < count; index += 1) {
    const raw = base32Encode(crypto.randomBytes(12)).slice(0, length);
    const formatted = raw.match(/.{1,5}/g)?.join("-") ?? raw;
    codes.push(formatted);
  }

  return codes;
};

export const hashRecoveryCode = (code: string): string =>
  crypto.createHmac("sha256", getRecoveryPepper()).update(code).digest("hex");
