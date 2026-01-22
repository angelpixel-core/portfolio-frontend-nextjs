import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";

const ENDPOINT = "social-networks";

const ContactPoint = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock("ContactPoint", "contact points", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      logger.error("ContactPoint", "fetchAll failed", error);
      throw error;
    }
  },
};

export default ContactPoint;
