import { logger } from "@/lib/logger";
import type { ContactPayload } from "./schema";

type PostmarkConfig = {
  token: string;
  sender: string;
  recipient: string;
};

const POSTMARK_API_URL = "https://api.postmarkapp.com/email";

const getPostmarkConfig = (): PostmarkConfig | null => {
  const token = process.env.POSTMARK_SERVER_TOKEN;
  const sender = process.env.POSTMARK_SENDER_EMAIL;
  const recipient = process.env.POSTMARK_RECIPIENT_EMAIL;

  if (!token || !sender || !recipient) {
    logger.warn("Contact", "Postmark env vars missing", {
      token: Boolean(token),
      sender: Boolean(sender),
      recipient: Boolean(recipient),
    });
    return null;
  }

  return { token, sender, recipient };
};

const buildMessageBody = (payload: ContactPayload): string => {
  const lines = [
    `Email: ${payload.email}`,
    payload.projectName ? `Project: ${payload.projectName}` : null,
    payload.source ? `Source: ${payload.source}` : null,
    payload.jobTypes?.length
      ? `Job Types: ${payload.jobTypes.join(", ")}`
      : null,
    "",
    payload.message,
  ].filter(Boolean);

  return lines.join("\n");
};

export const sendContactMessage = async (
  payload: ContactPayload
): Promise<{ ok: boolean }> => {
  const config = getPostmarkConfig();
  if (!config) {
    return { ok: false };
  }

  const subject = payload.projectName
    ? `New inquiry: ${payload.projectName}`
    : "New project inquiry";

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
        To: config.recipient,
        ReplyTo: payload.email,
        Subject: subject,
        TextBody: buildMessageBody(payload),
        MessageStream: "outbound",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error("Contact", "Postmark request failed", {
        status: response.status,
        body: errorBody,
      });
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    logger.error("Contact", "Postmark request error", error);
    return { ok: false };
  }
};
