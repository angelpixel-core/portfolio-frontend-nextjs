import { getEnvironmentContent } from "../../../environment-content";
import type { JobExperiencePersistence } from "../../../domains/job-experience/model/ports";
import {
  JobExperiencesSchema,
  type JobExperience,
} from "../../../domains/job-experience/model/schema";

const STATIC_EXPERIENCES = JobExperiencesSchema.parse(
  getEnvironmentContent("job-experiences.json")
);

const filterPublished = (
  items: JobExperience[],
  publish: boolean
): JobExperience[] => {
  return publish ? items.filter((item) => item.publish !== false) : items;
};

const JobExperienceSnapshotPersistence: JobExperiencePersistence = {
  capabilities: { read: true, write: false },
  async fetchAll({ publish = true } = {}) {
    return filterPublished(STATIC_EXPERIENCES, publish);
  },
  async updateById() {
    throw new Error("read_only");
  },
};

export default JobExperienceSnapshotPersistence;
