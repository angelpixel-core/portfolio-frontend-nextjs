import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { db } from "../../../../../db";
import { siteContactPoints, siteProfiles } from "../../../../../db/schema";
import { getAdminSessionEmail } from "@/lib/admin/getAdminSessionEmail";

type GeneralProvider =
  | "linkedin"
  | "github"
  | "twitter"
  | "telegram"
  | "calendly"
  | "whatsapp";

const ProviderMeta: Record<
  GeneralProvider,
  {
    id: number;
    type: "communication" | "social" | "messaging";
    label: string;
    icon: string;
    baseUrl: string;
    sortOrder: number;
  }
> = {
  linkedin: {
    id: 2,
    type: "social",
    label: "LinkedIn",
    icon: "LinkedIn",
    baseUrl: "https://linkedin.com/in/",
    sortOrder: 2,
  },
  github: {
    id: 3,
    type: "social",
    label: "GitHub",
    icon: "GitHub",
    baseUrl: "https://github.com/",
    sortOrder: 3,
  },
  whatsapp: {
    id: 4,
    type: "communication",
    label: "WhatsApp",
    icon: "WhatsApp",
    baseUrl: "https://wa.me/",
    sortOrder: 4,
  },
  twitter: {
    id: 5,
    type: "social",
    label: "Twitter",
    icon: "Twitter",
    baseUrl: "https://twitter.com/",
    sortOrder: 5,
  },
  telegram: {
    id: 7,
    type: "messaging",
    label: "Telegram",
    icon: "Telegram",
    baseUrl: "https://t.me/",
    sortOrder: 7,
  },
  calendly: {
    id: 8,
    type: "communication",
    label: "Calendly",
    icon: "Calendar",
    baseUrl: "https://calendly.com/",
    sortOrder: 8,
  },
};

const GeneralSettingsSchema = z.object({
  email: z.string().email(),
  linkedin: z.string().min(1),
  github: z.string().min(1),
  twitter: z.string().min(1),
  telegram: z.string().min(1),
  calendly: z.string().min(1),
  whatsapp: z.string().min(1),
});

const getProviderIdentifierMap = async (): Promise<
  Record<GeneralProvider, string>
> => {
  const rows = await db.select().from(siteContactPoints);
  const byProvider = new Map(rows.map((row) => [row.provider, row]));

  return {
    linkedin: byProvider.get("linkedin")?.identifier ?? "",
    github: byProvider.get("github")?.identifier ?? "",
    twitter: byProvider.get("twitter")?.identifier ?? "",
    telegram: byProvider.get("telegram")?.identifier ?? "",
    calendly: byProvider.get("calendly")?.identifier ?? "",
    whatsapp: byProvider.get("whatsapp")?.identifier ?? "",
  };
};

export const GET = async (request: NextRequest) => {
  const adminEmail = await getAdminSessionEmail(request.headers);

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const profile = await db
    .select()
    .from(siteProfiles)
    .where(eq(siteProfiles.id, 1))
    .limit(1);

  const identifiers = await getProviderIdentifierMap();

  return NextResponse.json({
    ok: true,
    settings: {
      email: profile[0]?.email ?? "",
      ...identifiers,
    },
  });
};

export const PUT = async (request: NextRequest) => {
  const adminEmail = await getAdminSessionEmail(request.headers);

  if (!adminEmail) {
    return NextResponse.json(
      { ok: false, error: "forbidden" },
      { status: 403 }
    );
  }

  const payload = await request.json().catch(() => null);
  const parsed = GeneralSettingsSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const normalized = {
    email: parsed.data.email.trim().toLowerCase(),
    linkedin: parsed.data.linkedin.trim(),
    github: parsed.data.github.trim(),
    twitter: parsed.data.twitter.trim(),
    telegram: parsed.data.telegram.trim(),
    calendly: parsed.data.calendly.trim(),
    whatsapp: parsed.data.whatsapp.trim(),
  };

  await db
    .update(siteProfiles)
    .set({
      email: normalized.email,
      heroLink: `${ProviderMeta.linkedin.baseUrl}${normalized.linkedin}`,
      hireMeLink: `${ProviderMeta.telegram.baseUrl}${normalized.telegram}`,
      updatedAt: new Date(),
    })
    .where(eq(siteProfiles.id, 1));

  const providers = Object.keys(ProviderMeta) as GeneralProvider[];

  for (const provider of providers) {
    const meta = ProviderMeta[provider];
    const identifier = normalized[provider];
    const href = `${meta.baseUrl}${identifier}`;

    await db
      .insert(siteContactPoints)
      .values({
        id: meta.id,
        type: meta.type,
        provider,
        label: meta.label,
        icon: meta.icon,
        identifier,
        href,
        value: href,
        visible: true,
        sortOrder: meta.sortOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: siteContactPoints.provider,
        set: {
          type: meta.type,
          label: meta.label,
          icon: meta.icon,
          identifier,
          href,
          value: href,
          visible: true,
          sortOrder: meta.sortOrder,
          updatedAt: new Date(),
        },
      });
  }

  await db
    .insert(siteContactPoints)
    .values({
      id: 1,
      type: "communication",
      provider: "email",
      label: "Email",
      icon: "Mail",
      identifier: normalized.email,
      href: `mailto:${normalized.email}`,
      value: normalized.email,
      visible: true,
      sortOrder: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: siteContactPoints.provider,
      set: {
        identifier: normalized.email,
        href: `mailto:${normalized.email}`,
        value: normalized.email,
        visible: true,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true, requestId: randomUUID() });
};
