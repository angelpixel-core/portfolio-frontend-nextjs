import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { ProjectSchema, ProjectsSchema } from "./schema";
import type { ProjectModel, ProjectsModel } from "./schema";

const ENDPOINT = "projects";

export type ProjectVisibility = "visible" | "hidden" | "all";

export interface FetchAllOptions {
  useMockFallback?: boolean;
  visibility?: ProjectVisibility | string | undefined;
}

interface FetchBySlugOptions {
  useMockFallback?: boolean;
}

export const normalizeVisibility = (
  value?: ProjectVisibility | string
): ProjectVisibility => {
  return value === "hidden" || value === "all" ? value : "visible";
};

const applyVisibilityFilter = (
  projects: ProjectsModel,
  visibility: ProjectVisibility
): ProjectsModel => {
  if (visibility === "all") {
    return projects;
  }

  const isVisible = visibility === "visible";
  return projects.filter((project) => project.visible === isVisible);
};

const Project = {
  async fetchAll({
    useMockFallback = true,
    visibility,
  }: FetchAllOptions = {}): Promise<ProjectsModel> {
    const normalizedVisibility = normalizeVisibility(visibility);

    if (useMockFallback) {
      logger.mock("Project", "projects", { delay: "2s" });
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const parsed = ProjectsSchema.parse(mockData);
      return applyVisibilityFilter(parsed, normalizedVisibility);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      const parsed = ProjectsSchema.parse(data);
      return applyVisibilityFilter(parsed, normalizedVisibility);
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
