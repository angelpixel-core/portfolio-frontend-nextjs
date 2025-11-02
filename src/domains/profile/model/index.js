import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "profiles";

const Profile = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Profile.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for profiles.");
        return mockData;
      }

      throw error;
    }
  },

  async fetchById(id, { useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      return data;
    } catch (error) {
      console.error(`🔴 Profile.fetchById(${id}) error:`, error);

      if (useMockFallback) {
        console.warn(`⚠️ Using mock data for profile ${id}.`);
        const fallback = mockData.find((item) => item.id === id);
        return fallback || null;
      }

      throw error;
    }
  },
};

export default Profile;
