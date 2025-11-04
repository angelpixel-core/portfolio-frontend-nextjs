import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "contents";

const Content = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      console.warn("⚠️  Using mock data for contents.");
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Content.fetchAll error:", error);
      throw error;
    }
  },

  async fetchById(id, { useMockFallback = true } = {}) {
    if (useMockFallback) {
      console.warn(`⚠️  Using mock data for content id=${id}.`);
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData.find((item) => item.id === id) || mockData[0];
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      return data;
    } catch (error) {
      console.error(`🔴 Content.fetchById(${id}) error:`, error);
      throw error;
    }
  },
};

export default Content;
