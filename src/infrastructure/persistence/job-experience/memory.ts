import { memoryStore } from "../../../db/memory-store";
import type { JobExperiencePersistence } from "../../../domains/job-experience/model/ports";
import {
  JobExperienceSchema,
  JobExperiencesSchema,
  type JobExperience,
} from "../../../domains/job-experience/model/schema";

const filterPublished = (
  items: JobExperience[],
  publish: boolean
): JobExperience[] => {
  return publish ? items.filter((item) => item.publish !== false) : items;
};

const updateStoredExperience = (
  id: number,
  payload: JobExperience
): JobExperience => {
  const list = memoryStore.getJobExperiences();
  const idx = list.findIndex((item) => item.id === id);

  if (idx === -1) {
    throw new Error(`Job experience ${id} not found`);
  }

  const normalized = { ...payload, id };
  list[idx] = normalized;
  memoryStore.setJobExperiences(list);
  return JobExperienceSchema.parse(normalized);
};

const JobExperienceMemoryPersistence: JobExperiencePersistence = {
  capabilities: { read: true, write: true },
  async fetchAll({ publish = true } = {}) {
    const source = memoryStore.getJobExperiences();
    return JobExperiencesSchema.parse(filterPublished(source, publish));
  },
  async updateById(id, payload) {
    return updateStoredExperience(id, payload);
  },
};

export default JobExperienceMemoryPersistence;
