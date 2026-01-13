import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { ExperienceStatsSchema } from "./schema";

const ENDPOINT = "experience-stats";

const ExperienceStat = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock('ExperienceStat', 'experience stats', { delay: '2s' });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return ExperienceStatsSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return ExperienceStatsSchema.parse(data);
    } catch (error) {
      logger.error('ExperienceStat', 'fetchAll failed', error);
      throw error;
    }
  },
};

export default ExperienceStat;
