import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { AcademicsSchema, type Academics } from "./schema";

const ENDPOINT = "academics";

interface FetchOptions {
  useMockFallback?: boolean;
}

const Academic = {
  async fetchAll({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<Academics> {
    if (useMockFallback) {
      logger.mock("Academic", "academics", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Validate mock data against schema
      return AcademicsSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      // Validate API response against schema
      return AcademicsSchema.parse(data);
    } catch (error) {
      logger.error("Academic", "fetchAll failed", error);
      throw error;
    }
  },
};

export default Academic;
