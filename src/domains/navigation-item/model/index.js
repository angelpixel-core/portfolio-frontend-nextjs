import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "features";

const NavigationItem = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 NavigationItem.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for navigation items.");
        return mockData;
      }

      throw error;
    }
  },
};

export default NavigationItem;
