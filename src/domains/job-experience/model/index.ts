import { asc, eq, inArray } from "drizzle-orm";

import { memoryStore } from "../../../db/memory-store";
import { isMemoryDriver } from "../../../db/runtime";
import { logger } from "@/lib/logger";
import {
  JobExperienceSchema,
  JobExperiencesSchema,
  type JobExperience,
} from "./schema";

type FetchAllOptions = {
  publish?: boolean;
};

type TaskByExperienceId = Record<number, JobExperience["work"]>;

const fetchAll = async ({ publish = true }: FetchAllOptions = {}): Promise<
  JobExperience[]
> => {
  if (isMemoryDriver()) {
    const source = memoryStore.getJobExperiences();
    const filtered = publish
      ? source.filter((row) => row.publish !== false)
      : source;
    return JobExperiencesSchema.parse(filtered);
  }

  try {
    const { db } = await import("../../../db");
    const { jobExperiences, jobExperienceTasks } =
      await import("../../../db/schema");

    const experienceRows = await db
      .select()
      .from(jobExperiences)
      .where(publish ? eq(jobExperiences.publish, true) : undefined)
      .orderBy(asc(jobExperiences.id));

    if (experienceRows.length === 0) {
      return [];
    }

    const experienceIds = experienceRows.map((row) => row.id);
    const allTaskRows = await db
      .select()
      .from(jobExperienceTasks)
      .where(inArray(jobExperienceTasks.jobExperienceId, experienceIds))
      .orderBy(
        asc(jobExperienceTasks.jobExperienceId),
        asc(jobExperienceTasks.sortOrder)
      );

    const tasksByExperienceId = allTaskRows.reduce<TaskByExperienceId>(
      (acc, task) => {
        const items = acc[task.jobExperienceId] ?? [];
        items.push({
          description: task.description,
          ...(task.tags ? { tags: task.tags } : {}),
        });
        acc[task.jobExperienceId] = items;
        return acc;
      },
      {}
    );

    const normalized = experienceRows.map((row) => ({
      id: row.id,
      publish: row.publish,
      position: row.position,
      company: row.company,
      companyLink: row.companyLink,
      time: row.time,
      year: row.year,
      address: row.address,
      contextBadges: row.contextBadges,
      technologies: row.technologies,
      group: row.group,
      work: tasksByExperienceId[row.id],
    }));

    return JobExperiencesSchema.parse(normalized);
  } catch (error) {
    logger.error("JobExperience", "fetchAll from DB failed", error);
    throw error;
  }
};

const updateById = async (
  id: number,
  payload: JobExperience
): Promise<JobExperience> => {
  const normalized = { ...payload, id };

  if (isMemoryDriver()) {
    const list = memoryStore.getJobExperiences();
    const idx = list.findIndex((item) => item.id === id);

    if (idx === -1) {
      throw new Error(`Job experience ${id} not found`);
    }

    list[idx] = normalized;
    memoryStore.setJobExperiences(list);
    return JobExperienceSchema.parse(normalized);
  }

  const { db } = await import("../../../db");
  const { jobExperiences, jobExperienceTasks } =
    await import("../../../db/schema");

  await db
    .update(jobExperiences)
    .set({
      publish: normalized.publish ?? true,
      position: normalized.position,
      company: normalized.company,
      companyLink: normalized.companyLink,
      time: normalized.time,
      year: normalized.year,
      address: normalized.address,
      contextBadges: normalized.contextBadges,
      technologies: normalized.technologies,
      group: normalized.group,
      updatedAt: new Date(),
    })
    .where(eq(jobExperiences.id, id));

  await db
    .delete(jobExperienceTasks)
    .where(eq(jobExperienceTasks.jobExperienceId, id));

  const workItems = normalized.work ?? [];
  if (workItems.length > 0) {
    await db.insert(jobExperienceTasks).values(
      workItems.map((item, index) => ({
        id: `${id}-${index + 1}`,
        jobExperienceId: id,
        sortOrder: index,
        description: item.description,
        tags: item.tags,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );
  }

  return JobExperienceSchema.parse(normalized);
};

const JobExperienceModel = {
  fetchAll,
  updateById,
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
