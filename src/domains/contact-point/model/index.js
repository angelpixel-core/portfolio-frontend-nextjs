import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "social-networks";

const ContactPoint = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 ContactPoint.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for contact points.");
        return mockData;
      }

      throw error;
    }
  },
};

export default ContactPoint;
