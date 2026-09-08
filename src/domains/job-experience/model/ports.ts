import type { JobExperience } from "./schema";

export type JobExperienceReadOptions = {
  publish?: boolean;
};

export type JobExperienceCapabilities = {
  read: true;
  write: boolean;
};

export interface JobExperiencePersistence {
  capabilities: JobExperienceCapabilities;
  fetchAll(_options?: JobExperienceReadOptions): Promise<JobExperience[]>;
  updateById(_id: number, _payload: JobExperience): Promise<JobExperience>;
}
