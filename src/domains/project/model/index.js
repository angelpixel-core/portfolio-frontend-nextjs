import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { ProjectsSchema } from "./schema";

const ENDPOINT = "projects";

const Project = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock("Project", "projects", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return ProjectsSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return ProjectsSchema.parse(data);
    } catch (error) {
      logger.error("Project", "fetchAll failed", error);
      throw error;
    }
  },
};

export default Project;
