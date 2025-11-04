import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "features";

const NavigationItem = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      console.warn("⚠️  Using mock data for navigation items.");
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 NavigationItem.fetchAll error:", error);
      throw error;
    }
  },
};

export default NavigationItem;
