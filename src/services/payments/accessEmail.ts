import { logger } from "@/lib/logger";

const POSTMARK_API_URL = "https://api.postmarkapp.com/email";

type PaymentAccessEmailInput = {
  toEmail: string;
  orderId: string;
  productKey: string;
};

const getConfig = (): {
  token: string;
  sender: string;
  siteUrl: string;
} | null => {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  const sender = process.env.POSTMARK_SENDER_EMAIL;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "http://localhost:9000";

  if (!token || !sender) {
    logger.error("Payments", "Missing Postmark config for access email", {
      hasToken: Boolean(token),
      hasSender: Boolean(sender),
    });
    return null;
  }

  return {
    token,
    sender,
    siteUrl: siteUrl.replace(/\/$/, ""),
  };
};

export const sendPaymentAccessEmail = async (
  input: PaymentAccessEmailInput
): Promise<{ ok: boolean }> => {
  const config = getConfig();
  if (!config) {
    return { ok: false };
  }

  const successUrl = `${config.siteUrl}/success?order_id=${input.orderId}`;

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
        To: input.toEmail,
        Subject: "Your access is ready",
        TextBody: [
          "Payment confirmed.",
          `Product: ${input.productKey}`,
          `Open your access page: ${successUrl}`,
        ].join("\n"),
        MessageStream: "outbound",
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error("Payments", "Failed to send access email", {
        status: response.status,
        body,
        orderId: input.orderId,
      });
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    logger.error("Payments", "Access email request failed", error);
    return { ok: false };
  }
};
