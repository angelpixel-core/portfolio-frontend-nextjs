import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import {
  ProfileSchema,
  ProfilesSchema,
  type ProfileModel,
  type ProfilesModel,
} from "./schema";

const ENDPOINT = "profiles";

interface FetchOptions {
  useMockFallback?: boolean;
}

const Profile = {
  async fetchAll({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<ProfilesModel> {
    if (useMockFallback) {
      logger.mock("Profile", "profiles", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return ProfilesSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return ProfilesSchema.parse(data);
    } catch (error) {
      logger.error("Profile", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback = true }: FetchOptions = {}
  ): Promise<ProfileModel> {
    if (useMockFallback) {
      logger.mock("Profile", "profile", { id, delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return ProfileSchema.parse(mockData[0]);
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      return ProfileSchema.parse(data);
    } catch (error) {
      logger.error("Profile", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Profile;
