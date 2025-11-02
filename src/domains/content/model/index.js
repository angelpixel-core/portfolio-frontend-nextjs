import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "contents";

const Content = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Content.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for contents.");
        return mockData;
      }

      throw error;
    }
  },
};

export default Content;
