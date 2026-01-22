import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";

const ENDPOINT = "job-experiences";

const JobExperience = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock("JobExperience", "job experiences", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return mockData;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      logger.error("JobExperience", "fetchAll failed", error);
      throw error;
    }
  },
};

export default JobExperience;
