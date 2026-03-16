import { resolveContentSource } from "@/lib/content-source";
import { logger } from "@/lib/logger";
import {
  ProfileSchema,
  ProfilesSchema,
  type ProfileModel,
  type ProfilesModel,
} from "./schema";

const ENDPOINT = "profiles";
const ENV_KEY = "NEXT_PUBLIC_PROFILES";

interface FetchOptions {
  useMockFallback?: boolean;
}

const Profile = {
  async fetchAll({
    useMockFallback: _useMockFallback = true,
  }: FetchOptions = {}): Promise<ProfilesModel> {
    try {
      return await resolveContentSource({
        envKey: ENV_KEY,
        schema: ProfilesSchema,
        endpoint: ENDPOINT,
        defaultEnvValue: "file:profiles.json",
      });
    } catch (error) {
      logger.error("Profile", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback: _useMockFallback = true }: FetchOptions = {}
  ): Promise<ProfileModel> {
    try {
      const profiles = await Profile.fetchAll();
      const profile = profiles.find((item) => item.id === id) || profiles[0];
      return ProfileSchema.parse(profile);
    } catch (error) {
      logger.error("Profile", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Profile;
