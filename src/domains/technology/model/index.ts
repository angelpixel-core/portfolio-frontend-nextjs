import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";

const ENDPOINT = "technologies";

const Technology = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock("Technology", "technologies", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      logger.error("Technology", "fetchAll failed", error);
      throw error;
    }
  },
};

export default Technology;

// Re-export schema types
export {
  TechnologySchema,
  TechnologiesSchema,
  type TechnologyModel,
  type TechnologiesModel,
} from "./schema";
