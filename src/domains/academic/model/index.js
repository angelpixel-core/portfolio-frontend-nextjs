import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";

const ENDPOINT = "articles";

const Academic = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock("Academic", "academics", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      logger.error("Academic", "fetchAll failed", error);
      throw error;
    }
  },
};

export default Academic;
