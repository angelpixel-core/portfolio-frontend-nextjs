import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { ProjectSchema, ProjectsSchema } from "./schema";
import type { ProjectModel, ProjectsModel } from "./schema";

const ENDPOINT = "projects";

interface FetchAllOptions {
  useMockFallback?: boolean;
}

interface FetchBySlugOptions {
  useMockFallback?: boolean;
}

const Project = {
  async fetchAll({
    useMockFallback = true,
  }: FetchAllOptions = {}): Promise<ProjectsModel> {
    if (useMockFallback) {
      logger.mock("Project", "projects", { delay: "2s" });
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

  async fetchBySlug(
    slug: string,
    { useMockFallback = true }: FetchBySlugOptions = {}
  ): Promise<ProjectModel | null> {
    if (useMockFallback) {
      logger.mock("Project", `project/${slug}`, { delay: "1s" });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const project = mockData.find((p: { slug: string }) => p.slug === slug);
      return project ? ProjectSchema.parse(project) : null;
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${slug}`);
      return ProjectSchema.parse(data);
    } catch (error) {
      logger.error("Project", `fetchBySlug(${slug}) failed`, error);
      return null;
    }
  },
};

export default Project;
