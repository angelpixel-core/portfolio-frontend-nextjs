import type { JobExperience } from "../../domains/job-experience/model/schema";
import { getJobExperiencePersistence } from "../../infrastructure/persistence/job-experience";
import type { JobExperienceReadOptions } from "../../domains/job-experience/model/ports";

export const fetchJobExperiences = async (
  options: JobExperienceReadOptions = {}
): Promise<JobExperience[]> => {
  return getJobExperiencePersistence().fetchAll(options);
};

export const updateJobExperienceById = async (
  id: number,
  payload: JobExperience
): Promise<JobExperience> => {
  return getJobExperiencePersistence().updateById(id, payload);
};

export const getJobExperienceCapabilities = () => {
  return getJobExperiencePersistence().capabilities;
};
