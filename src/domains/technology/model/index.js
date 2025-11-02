import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "technologies";

const Technology = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Technology.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for technologies.");
        return mockData;
      }

      throw error;
    }
  },
};

export default Technology;
