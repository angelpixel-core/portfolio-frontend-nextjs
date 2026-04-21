import { createHmac, timingSafeEqual } from "crypto";

const DEFAULT_TOLERANCE_SECONDS = 300;

const safeCompareHex = (left: string, right: string): boolean => {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
};

const parseSignatureHeader = (
  signatureHeader: string
): { timestamp: number; signatures: string[] } | null => {
  const fragments = signatureHeader
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const timestampPart = fragments.find((fragment) => fragment.startsWith("t="));
  const signatureParts = fragments
    .filter((fragment) => fragment.startsWith("v1="))
    .map((fragment) => fragment.slice(3))
    .filter(Boolean);

  if (!timestampPart || signatureParts.length === 0) {
    return null;
  }

  const timestamp = Number(timestampPart.slice(2));
  if (!Number.isFinite(timestamp)) {
    return null;
  }

  return { timestamp, signatures: signatureParts };
};

export const verifyStripeWebhookSignature = (
  payload: string,
  signatureHeader: string | null,
  secret: string,
  nowMs: number = Date.now(),
  toleranceSeconds: number = DEFAULT_TOLERANCE_SECONDS
): boolean => {
  if (!signatureHeader || !secret) {
    return false;
  }

  const parsed = parseSignatureHeader(signatureHeader);
  if (!parsed) {
    return false;
  }

  const nowSeconds = Math.floor(nowMs / 1000);
  if (Math.abs(nowSeconds - parsed.timestamp) > toleranceSeconds) {
    return false;
  }

  const signedPayload = `${parsed.timestamp}.${payload}`;
  const expectedSignature = createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");

  return parsed.signatures.some((signature) =>
    safeCompareHex(signature, expectedSignature)
  );
};
