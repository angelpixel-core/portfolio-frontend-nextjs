import { eq } from "drizzle-orm";
import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import { memoryStore } from "../../../db/memory-store";
import { isMemoryDriver } from "../../../db/runtime";
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

  async fetchAllForAdmin(): Promise<ProjectsModel> {
    if (isMemoryDriver()) {
      return ProjectsSchema.parse(memoryStore.getProjects());
    }

    const { db } = await import("../../../db");
    const { contentProjects } = await import("../../../db/schema");

    const rows = await db.select().from(contentProjects);
    return ProjectsSchema.parse(rows);
  },

  async updateById(id: number, payload: ProjectModel): Promise<ProjectModel> {
    if (isMemoryDriver()) {
      const items = memoryStore.getProjects();
      const idx = items.findIndex((item) => item.id === id);

      if (idx === -1) {
        throw new Error(`Project ${id} not found`);
      }

      const normalized = ProjectSchema.parse({ ...payload, id });
      items[idx] = normalized;
      memoryStore.setProjects(items);
      return normalized;
    }

    const normalized = ProjectSchema.parse({ ...payload, id });
    const { db } = await import("../../../db");
    const { contentProjects } = await import("../../../db/schema");

    const existing = await db
      .select({ id: contentProjects.id })
      .from(contentProjects)
      .where(eq(contentProjects.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new Error(`Project ${id} not found`);
    }

    await db
      .update(contentProjects)
      .set({
        ...normalized,
        updatedAt: new Date(),
      })
      .where(eq(contentProjects.id, id));

    return normalized;
  },

  async reorderByIds(ids: number[]): Promise<ProjectsModel> {
    if (isMemoryDriver()) {
      const items = memoryStore.getProjects();
      const byId = new Map(items.map((item) => [item.id, item]));

      const hasInvalidId = ids.some((itemId) => !byId.has(itemId));
      if (hasInvalidId || ids.length !== items.length) {
        throw new Error("Invalid project ids for reorder");
      }

      const reordered = ids.map((itemId, index) => {
        const item = byId.get(itemId) as ProjectModel;
        return {
          ...item,
          priority: ids.length - index,
        };
      });

      const parsed = ProjectsSchema.parse(reordered);
      memoryStore.setProjects(parsed);
      return parsed;
    }

    const { db } = await import("../../../db");
    const { contentProjects } = await import("../../../db/schema");
    const rows = await db.select().from(contentProjects);
    const current = ProjectsSchema.parse(rows);
    const byId = new Map(current.map((item) => [item.id, item]));

    const hasInvalidId = ids.some((itemId) => !byId.has(itemId));
    if (hasInvalidId || ids.length !== current.length) {
      throw new Error("Invalid project ids for reorder");
    }

    const reordered = ids.map((itemId, index) => {
      const item = byId.get(itemId) as ProjectModel;
      return {
        ...item,
        priority: ids.length - index,
      };
    });

    for (const item of reordered) {
      await db
        .update(contentProjects)
        .set({ priority: item.priority, updatedAt: new Date() })
        .where(eq(contentProjects.id, item.id));
    }

    const parsed = ProjectsSchema.parse(reordered);
    return parsed;
  },
};

export default Project;
