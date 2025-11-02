import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "articles";

const Academic = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Academic.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for academics.");
        return mockData;
      }

      throw error;
    }
  },
};

export default Academic;
