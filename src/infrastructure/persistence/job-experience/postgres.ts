import { asc, eq, inArray } from "drizzle-orm";

import type { JobExperiencePersistence } from "../../../domains/job-experience/model/ports";
import {
  JobExperienceSchema,
  JobExperiencesSchema,
  type JobExperience,
} from "../../../domains/job-experience/model/schema";

type TaskByExperienceId = Record<number, JobExperience["work"]>;

const mapRows = (
  experienceRows: Array<{
    id: number;
    publish: boolean | null;
    position: string;
    company: string;
    companyLink: string;
    time: string;
    year: string;
    address: string;
    contextBadges: string[];
    technologies: string[];
    group: JobExperience["group"];
  }>,
  tasksByExperienceId: TaskByExperienceId
): JobExperience[] => {
  return experienceRows.map((row) => ({
    id: row.id,
    publish: row.publish ?? undefined,
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
};

const readFromDb = async (publish: boolean): Promise<JobExperience[]> => {
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

  return JobExperiencesSchema.parse(
    mapRows(experienceRows, tasksByExperienceId)
  );
};

const updateInDb = async (
  id: number,
  payload: JobExperience
): Promise<JobExperience> => {
  const { db } = await import("../../../db");
  const { jobExperiences, jobExperienceTasks } =
    await import("../../../db/schema");

  const normalized = { ...payload, id };

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
      workItems.map(
        (
          item,
          index
        ): {
          id: string;
          jobExperienceId: number;
          sortOrder: number;
          description: string;
          tags?: string[];
          createdAt: Date;
          updatedAt: Date;
        } => ({
          id: `${id}-${index + 1}`,
          jobExperienceId: id,
          sortOrder: index,
          description: item.description,
          tags: item.tags,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      )
    );
  }

  return JobExperienceSchema.parse(normalized);
};

const JobExperiencePostgresPersistence: JobExperiencePersistence = {
  capabilities: { read: true, write: true },
  async fetchAll({ publish = true } = {}) {
    try {
      return await readFromDb(publish);
    } catch (_error) {
      const snapshot = (await import("./snapshot-json")).default;
      return snapshot.fetchAll({ publish });
    }
  },
  async updateById(id, payload) {
    return updateInDb(id, payload);
  },
};

export default JobExperiencePostgresPersistence;
