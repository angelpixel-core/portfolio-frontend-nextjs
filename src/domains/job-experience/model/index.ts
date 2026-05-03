import { asc, eq, inArray } from "drizzle-orm";

import { db } from "../../../db";
import { jobExperiences, jobExperienceTasks } from "../../../db/schema";
import { logger } from "@/lib/logger";
import { JobExperiencesSchema, type JobExperience } from "./schema";

type FetchAllOptions = {
  publish?: boolean;
};

type TaskByExperienceId = Record<number, JobExperience["work"]>;

const fetchAll = async ({ publish = true }: FetchAllOptions = {}): Promise<
  JobExperience[]
> => {
  try {
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

const JobExperienceModel = {
  fetchAll,
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
