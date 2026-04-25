import { logger } from "@/lib/logger";

type PostmarkConfig = {
  token: string;
  sender: string;
};

type SendConfirmEmailInput = {
  email: string;
  confirmToken: string;
  unsubscribeToken: string;
};

const POSTMARK_API_URL = "https://api.postmarkapp.com/email";

const getPostmarkConfig = (): PostmarkConfig | null => {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  const sender = process.env.POSTMARK_SENDER_EMAIL;

  if (!token || !sender) {
    logger.warn("Subscription", "Postmark env vars missing", {
      token: Boolean(token),
      sender: Boolean(sender),
    });
    return null;
  }

  return { token, sender };
};

const getBaseUrl = (): string => {
  return (
    process.env.SUBSCRIBE_CONFIRM_BASE_URL ??
    process.env.SITE_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:9000"
  );
};

const buildConfirmUrl = (token: string): string => {
  const base = getBaseUrl();
  return `${base}/api/subscriptions/confirm?token=${encodeURIComponent(token)}`;
};

const buildUnsubscribeUrl = (token: string): string => {
  const base = getBaseUrl();
  return `${base}/unsubscribe?token=${encodeURIComponent(token)}`;
};

export const sendSubscriptionConfirmEmail = async (
  input: SendConfirmEmailInput
): Promise<{ ok: boolean }> => {
  const config = getPostmarkConfig();
  if (!config) {
    return { ok: false };
  }

  const confirmUrl = buildConfirmUrl(input.confirmToken);
  const unsubscribeUrl = buildUnsubscribeUrl(input.unsubscribeToken);

  const body = [
    "Confirm your subscription",
    "",
    "Check your inbox and confirm your subscription using this link:",
    confirmUrl,
    "",
    "If you did not request this, you can ignore this email.",
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join("\n");

  try {
    const response = await fetch(POSTMARK_API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": config.token,
      },
      body: JSON.stringify({
        From: config.sender,
        To: input.email,
        Subject: "Confirm your subscription",
        TextBody: body,
        MessageStream: "outbound",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error("Subscription", "Postmark request failed", {
        status: response.status,
        body: errorBody,
      });
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    logger.error("Subscription", "Postmark request error", error);
    return { ok: false };
  }
};
