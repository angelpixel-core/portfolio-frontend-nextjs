import { asc, eq } from "drizzle-orm";
import type { ProfilePublicPersistence } from "../../../domains/profile/ports";
import {
  ProfilesSchema,
  ProfileSchema,
} from "../../../domains/profile/model/schema";

const postgres: ProfilePublicPersistence = {
  capabilities: { read: true, write: false },
  async fetchAll() {
    const { db } = await import("../../../db");
    const { siteContactPoints, siteProfiles } =
      await import("../../../db/schema");
    const profiles = await db
      .select()
      .from(siteProfiles)
      .orderBy(asc(siteProfiles.id));
    const contacts = await db
      .select()
      .from(siteContactPoints)
      .where(eq(siteContactPoints.visible, true));
    const links = new Map(contacts.map((item) => [item.provider, item.href]));
    const linkKeys = [
      "linkedin",
      "github",
      "twitter",
      "dribbble",
      "telegram",
      "whatsapp",
      "calendly",
    ] as const;
    return ProfilesSchema.parse(
      profiles.map((row) => ({
        id: row.id,
        nickname: row.nickname,
        authorName: row.authorName,
        biography: row.biography,
        avatar: row.avatar,
        ...(row.logo ? { logo: row.logo } : {}),
        location: row.location,
        email: row.email,
        ...Object.fromEntries(
          linkKeys
            .filter((key) => links.has(key))
            .map((key) => [key, links.get(key)])
        ),
        ...(row.resume ? { resume: row.resume } : {}),
        ...(row.heroLink ? { heroLink: row.heroLink } : {}),
        ...(row.hireMeLink ? { hireMeLink: row.hireMeLink } : {}),
      }))
    );
  },
  async fetchById(id) {
    const profile = (await this.fetchAll()).find((item) => item.id === id);
    if (!profile) throw new Error("Profile not found");
    return ProfileSchema.parse(profile);
  },
};

export default postgres;
