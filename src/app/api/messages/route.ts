import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { logger } from "@/lib/logger";
import { ContactSchema } from "@/services/contact/schema";
import { sendContactMessage } from "@/services/contact/postmark";
import { checkRateLimit } from "@/services/contact/rateLimit";
import { trackServerEvent } from "@/services/analytics/server";

const MIN_FORM_DURATION_MS = 3000;
const MAX_ATTACHMENT_BYTES = 9 * 1024 * 1024;

type FormDataEntryValue = string | File;

const getClientIp = (request: NextRequest): string => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
};

const getStringValue = (value: FormDataEntryValue | null): string => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const getStringArray = (values: FormDataEntryValue[]): string[] =>
  values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);

const getNumberValue = (
  value: FormDataEntryValue | null
): number | undefined => {
  if (typeof value !== "string" || value.trim().length === 0) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toEmailAttachment = async (value: FormDataEntryValue) => {
  if (!(value instanceof File)) return null;

  const content = Buffer.from(await value.arrayBuffer()).toString("base64");

  return {
    Name: value.name,
    Content: content,
    ContentType: value.type || "application/octet-stream",
    Size: value.size,
  };
};

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const source = getStringValue(formData.get("source")) || undefined;
    const payload = {
      email: getStringValue(formData.get("email")),
      message: getStringValue(formData.get("message")),
      projectName: getStringValue(formData.get("projectName")) || undefined,
      source,
      jobTypes: getStringArray(formData.getAll("jobTypes")) || undefined,
      formStart: getNumberValue(formData.get("formStart")),
      honeypot: getStringValue(formData.get("honeypot")) || undefined,
    };

    const attachmentEntries = formData.getAll("attachment");
    const oversizeAttachment = attachmentEntries.find(
      (entry) => entry instanceof File && entry.size > MAX_ATTACHMENT_BYTES
    );
    if (oversizeAttachment) {
      return NextResponse.json(
        { ok: false, error: "attachment_too_large" },
        { status: 413 }
      );
    }
    const attachments = (
      await Promise.all(attachmentEntries.map(toEmailAttachment))
    ).filter(
      (
        attachment
      ): attachment is NonNullable<
        Awaited<ReturnType<typeof toEmailAttachment>>
      > => Boolean(attachment)
    );

    const parsed = ContactSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "invalid" },
        { status: 400 }
      );
    }

    const ip = getClientIp(request);
    const referer = request.headers.get("referer") || undefined;
    const userAgent = request.headers.get("user-agent") || undefined;
    const trackOptions = {
      url: referer ?? request.url,
      ip,
      userAgent,
      referrer: referer,
    };
    const eventProps = {
      label: parsed.data.projectName,
      source,
    };
    const now = Date.now();
    const isHoneypot = Boolean(parsed.data.honeypot?.trim());
    const isTooFast =
      typeof parsed.data.formStart === "number" &&
      now - parsed.data.formStart < MIN_FORM_DURATION_MS;

    if (isHoneypot || isTooFast) {
      await trackServerEvent("spam_blocked", eventProps, trackOptions);
      return NextResponse.json({ ok: true });
    }

    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.success) {
      await trackServerEvent("rate_limited", eventProps, trackOptions);
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 }
      );
    }

    const delivery = await sendContactMessage(parsed.data, attachments);
    if (!delivery.ok) {
      return NextResponse.json(
        { ok: false, error: "provider_error" },
        { status: 502 }
      );
    }

    await trackServerEvent("message_sent", eventProps, trackOptions);
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error("Contact", "Failed to process message", error);
    return NextResponse.json(
      { ok: false, error: "provider_error" },
      { status: 500 }
    );
  }
};
