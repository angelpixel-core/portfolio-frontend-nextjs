import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "profiles";

const Profile = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      console.warn("⚠️  Using mock data for profiles.");
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Profile.fetchAll error:", error);
      throw error;
    }
  },

  async fetchById(id, { useMockFallback = true } = {}) {
    if (useMockFallback) {
      console.warn("⚠️  Using mock data for profile id=1.");
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData[0];
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      return data;
    } catch (error) {
      console.error(`🔴 Profile.fetchById(${id}) error:`, error);
      throw error;
    }
  },
};

export default Profile;
