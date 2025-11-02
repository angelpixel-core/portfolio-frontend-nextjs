import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "experience-stats";

const ExperienceStat = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 ExperienceStat.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for experience stats.");
        return mockData;
      }

      throw error;
    }
  },
};

export default ExperienceStat;
