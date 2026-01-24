import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { JobExperiencesSchema, type JobExperience } from "./schema";

const ENDPOINT = "job-experiences";

interface FetchAllOptions {
  useMockFallback?: boolean;
}

const JobExperienceModel = {
  async fetchAll({ useMockFallback = true }: FetchAllOptions = {}): Promise<
    JobExperience[]
  > {
    if (useMockFallback) {
      logger.mock("JobExperience", "job experiences", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Validate mock data at runtime
      const validated = JobExperiencesSchema.parse(mockData);
      return validated;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      // Validate API response
      const validated = JobExperiencesSchema.parse(data);
      return validated;
    } catch (error) {
      logger.error("JobExperience", "fetchAll failed", error);
      throw error;
    }
  },
};

export default JobExperienceModel;

// Re-export types and schemas from schema.ts
export {
  JobExperienceSchema,
  JobExperienceTaskSchema,
  JobExperiencesSchema,
  type JobExperience,
  type JobExperienceTask,
  type JobExperiences,
} from "./schema";
