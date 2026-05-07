import { asc, eq } from "drizzle-orm";

import { db } from "../../../db";
import { siteContactPoints, siteProfiles } from "../../../db/schema";
import { logger } from "@/lib/logger";
import {
  ProfileSchema,
  ProfilesSchema,
  type ProfileModel,
  type ProfilesModel,
} from "./schema";

interface FetchOptions {
  useMockFallback?: boolean;
}

const mapProfiles = async (): Promise<ProfilesModel> => {
  const profiles = await db
    .select()
    .from(siteProfiles)
    .orderBy(asc(siteProfiles.id));

  if (profiles.length === 0) {
    return ProfilesSchema.parse([]);
  }

  const contacts = await db
    .select()
    .from(siteContactPoints)
    .where(eq(siteContactPoints.visible, true));
  const socialMap = new Map(contacts.map((item) => [item.provider, item.href]));

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
      ...(socialMap.get("linkedin")
        ? { linkedin: socialMap.get("linkedin") as string }
        : {}),
      ...(socialMap.get("github")
        ? { github: socialMap.get("github") as string }
        : {}),
      ...(socialMap.get("twitter")
        ? { twitter: socialMap.get("twitter") as string }
        : {}),
      ...(socialMap.get("dribbble")
        ? { dribbble: socialMap.get("dribbble") as string }
        : {}),
      ...(socialMap.get("telegram")
        ? { telegram: socialMap.get("telegram") as string }
        : {}),
      ...(socialMap.get("whatsapp")
        ? { whatsapp: socialMap.get("whatsapp") as string }
        : {}),
      ...(socialMap.get("calendly")
        ? { calendly: socialMap.get("calendly") as string }
        : {}),
      ...(row.resume ? { resume: row.resume } : {}),
      ...(row.heroLink ? { heroLink: row.heroLink } : {}),
      ...(row.hireMeLink ? { hireMeLink: row.hireMeLink } : {}),
    }))
  );
};

const Profile = {
  async fetchAll({
    useMockFallback: _useMockFallback = false,
  }: FetchOptions = {}): Promise<ProfilesModel> {
    try {
      return await mapProfiles();
    } catch (error) {
      logger.error("Profile", "fetchAll from DB failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback: _useMockFallback = false }: FetchOptions = {}
  ): Promise<ProfileModel> {
    try {
      const profiles = await Profile.fetchAll();
      const profile = profiles.find((item) => item.id === id) || profiles[0];

      if (!profile) {
        throw new Error("Profile not found");
      }

      return ProfileSchema.parse(profile);
    } catch (error) {
      logger.error("Profile", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Profile;
