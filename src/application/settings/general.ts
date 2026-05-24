import { eq } from "drizzle-orm";

import { db } from "../../db";
import { siteContactPoints, siteProfiles } from "../../db/schema";

type GeneralProvider =
  | "linkedin"
  | "github"
  | "twitter"
  | "telegram"
  | "calendly"
  | "whatsapp";

type ProviderMeta = {
  id: number;
  type: "communication" | "social" | "messaging";
  label: string;
  icon: string;
  baseUrl: string;
  sortOrder: number;
};

const PROVIDER_META: Record<GeneralProvider, ProviderMeta> = {
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

export type GeneralSettingsPayload = {
  email: string;
  linkedin: string;
  github: string;
  twitter: string;
  telegram: string;
  calendly: string;
  whatsapp: string;
};

type ProviderIdentifierMap = Record<GeneralProvider, string>;

const getProviderIdentifierMap = async (): Promise<ProviderIdentifierMap> => {
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

export const getGeneralSettings = async () => {
  const profile = await db
    .select()
    .from(siteProfiles)
    .where(eq(siteProfiles.id, 1))
    .limit(1);

  const identifiers = await getProviderIdentifierMap();

  return {
    email: profile[0]?.email ?? "",
    ...identifiers,
  };
};

export const updateGeneralSettings = async (payload: GeneralSettingsPayload) => {
  const normalized = {
    email: payload.email.trim().toLowerCase(),
    linkedin: payload.linkedin.trim(),
    github: payload.github.trim(),
    twitter: payload.twitter.trim(),
    telegram: payload.telegram.trim(),
    calendly: payload.calendly.trim(),
    whatsapp: payload.whatsapp.trim(),
  };

  await db
    .update(siteProfiles)
    .set({
      email: normalized.email,
      heroLink: `${PROVIDER_META.linkedin.baseUrl}${normalized.linkedin}`,
      hireMeLink: `${PROVIDER_META.telegram.baseUrl}${normalized.telegram}`,
      updatedAt: new Date(),
    })
    .where(eq(siteProfiles.id, 1));

  const providers = Object.keys(PROVIDER_META) as GeneralProvider[];

  for (const provider of providers) {
    const meta = PROVIDER_META[provider];
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
};
