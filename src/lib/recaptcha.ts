export type RecaptchaVerifyResult = {
  ok: boolean;
  score?: number;
  action?: string;
  errorCodes?: string[];
  reason?:
    | "missing_secret"
    | "missing_token"
    | "network_error"
    | "verification_failed"
    | "missing_score"
    | "low_score"
    | "action_mismatch";
};

export type RecaptchaErrorType = "recaptcha_invalid" | "recaptcha_failed";

export const recaptchaErrorPayload = (error: RecaptchaErrorType) => ({
  ok: false,
  error,
});

type RecaptchaApiResponse = {
  success: boolean;
  score?: number;
  action?: string;
  hostname?: string;
  challenge_ts?: string;
  "error-codes"?: string[];
};

type GrecaptchaInstance = {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: GrecaptchaInstance;
  }
}

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
const RECAPTCHA_SCRIPT_BASE = "https://www.google.com/recaptcha/api.js";
const DEFAULT_MIN_SCORE = 0.5;
const SCRIPT_DATA_ATTR = "data-recaptcha-script";

let scriptLoadPromise: Promise<void> | null = null;

const getRecaptchaSiteKey = (): string =>
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

const getRecaptchaSecretKey = (): string =>
  process.env.RECAPTCHA_SECRET_KEY ?? "";

const getRecaptchaMinScore = (): number => {
  const raw = process.env.RECAPTCHA_MIN_SCORE;
  if (!raw) return DEFAULT_MIN_SCORE;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : DEFAULT_MIN_SCORE;
};

const ensureRecaptchaScript = (): Promise<void> => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Recaptcha unavailable on server"));
  }

  const siteKey = getRecaptchaSiteKey();
  if (!siteKey) {
    return Promise.reject(new Error("Missing recaptcha site key"));
  }

  if (window.grecaptcha?.execute) {
    return Promise.resolve();
  }

  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[${SCRIPT_DATA_ATTR}], script[src^="${RECAPTCHA_SCRIPT_BASE}"]`
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Recaptcha script failed to load")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `${RECAPTCHA_SCRIPT_BASE}?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    script.setAttribute(SCRIPT_DATA_ATTR, "true");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () =>
      reject(new Error("Recaptcha script failed to load"))
    );
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};

export const loadRecaptchaScript = async (): Promise<void> => {
  await ensureRecaptchaScript();

  if (!window.grecaptcha?.ready) {
    throw new Error("Recaptcha script not ready");
  }

  await new Promise<void>((resolve) => {
    window.grecaptcha?.ready(() => resolve());
  });
};

export const getRecaptchaToken = async (action: string): Promise<string> => {
  await loadRecaptchaScript();
  const siteKey = getRecaptchaSiteKey();
  if (!siteKey) {
    throw new Error("Missing recaptcha site key");
  }

  if (!window.grecaptcha?.execute) {
    throw new Error("Recaptcha not available");
  }

  return window.grecaptcha.execute(siteKey, { action });
};

export const verifyRecaptchaToken = async (
  token: string | undefined,
  expectedAction: string,
  minScore: number = getRecaptchaMinScore()
): Promise<RecaptchaVerifyResult> => {
  const secret = getRecaptchaSecretKey();
  if (!secret) {
    return { ok: false, reason: "missing_secret" };
  }

  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!response.ok) {
      return { ok: false, reason: "network_error" };
    }

    const data = (await response.json()) as RecaptchaApiResponse;
    const score = typeof data.score === "number" ? data.score : undefined;
    const action = typeof data.action === "string" ? data.action : undefined;

    if (!data.success) {
      return {
        ok: false,
        score,
        action,
        errorCodes: data["error-codes"],
        reason: "verification_failed",
      };
    }

    if (typeof score !== "number") {
      return { ok: false, action, reason: "missing_score" };
    }

    if (score < minScore) {
      return {
        ok: false,
        score,
        action,
        errorCodes: data["error-codes"],
        reason: "low_score",
      };
    }

    if (!action || action !== expectedAction) {
      return {
        ok: false,
        score,
        action,
        errorCodes: data["error-codes"],
        reason: "action_mismatch",
      };
    }

    return {
      ok: true,
      score,
      action,
      errorCodes: data["error-codes"],
    };
  } catch (error) {
    return { ok: false, reason: "network_error" };
  }
};
