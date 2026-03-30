import { logger } from "@/lib/logger";
import type { ContactPayload } from "./schema";
import type { ResumeRequestPayload } from "../resumeRequest/schema";

type EmailAttachment = {
  Name: string;
  Content: string;
  ContentType: string;
  Size: number;
};

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

const buildMessageBody = (
  payload: ContactPayload,
  attachments: EmailAttachment[] = []
): string => {
  const meta = {
    email: payload.email,
    projectName: payload.projectName ?? null,
    source: payload.source ?? null,
    jobTypes: payload.jobTypes ?? [],
    message: payload.message,
    attachments: attachments.map(({ Name, ContentType, Size }) => ({
      name: Name,
      type: ContentType,
      size: Size,
    })),
  };

  return JSON.stringify(meta, null, 2);
};

const buildResumeRequestBody = (
  user: { id: string; email: string; name?: string },
  payload: ResumeRequestPayload
): string => {
  const meta = {
    event: "resume_request",
    source: payload.source,
    user: {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
    },
    context: payload.context ?? null,
    role: payload.role ?? null,
    notes: payload.notes ?? null,
  };

  return JSON.stringify(meta, null, 2);
};

export const sendContactMessage = async (
  payload: ContactPayload,
  attachments: EmailAttachment[] = []
): Promise<{ ok: boolean }> => {
  const config = getPostmarkConfig();
  if (!config) {
    return { ok: false };
  }

  const subject = `New inquiry · ${payload.projectName ?? "General"} · ${
    payload.source ?? "unknown"
  }`;

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
        TextBody: buildMessageBody(payload, attachments),
        Attachments: attachments.map(({ Name, Content, ContentType }) => ({
          Name,
          Content,
          ContentType,
        })),
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

export const sendResumeRequestEmail = async (
  user: { id: string; email: string; name?: string },
  payload: ResumeRequestPayload
): Promise<{ ok: boolean }> => {
  const config = getPostmarkConfig();
  if (!config) {
    return { ok: false };
  }

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
        ReplyTo: user.email,
        Subject: "Request for Resume",
        TextBody: buildResumeRequestBody(user, payload),
        MessageStream: "outbound",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error("ResumeRequest", "Postmark request failed", {
        status: response.status,
        body: errorBody,
      });
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    logger.error("ResumeRequest", "Postmark request error", error);
    return { ok: false };
  }
};
