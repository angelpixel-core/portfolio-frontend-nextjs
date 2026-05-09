import "server-only";

import { eq } from "drizzle-orm";

import { memoryStore } from "../../../db/memory-store";
import { isMemoryDriver } from "../../../db/runtime";
import {
  ProjectSchema,
  ProjectsSchema,
  type ProjectModel,
  type ProjectsModel,
} from "./schema";

const projectAdminModel = {
  async fetchAllForAdmin(): Promise<ProjectsModel> {
    if (isMemoryDriver()) {
      return ProjectsSchema.parse(memoryStore.getProjects());
    }

    const { db } = await import("../../../db");
    const { contentProjects, contentAssets } =
      await import("../../../db/schema");
    const rows = await db
      .select({
        project: contentProjects,
        assetUrl: contentAssets.url,
        assetId: contentAssets.id,
      })
      .from(contentProjects)
      .leftJoin(
        contentAssets,
        eq(contentProjects.heroAssetId, contentAssets.id)
      );

    const normalized = rows.map(({ project, assetUrl, assetId }) => ({
      ...project,
      img: assetUrl ?? project.img,
      hero_asset_id: assetId ?? project.heroAssetId ?? undefined,
    }));

    return ProjectsSchema.parse(normalized);
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

    return ProjectsSchema.parse(reordered);
  },
};

export default projectAdminModel;
