import jobExperiencesMock from "@/domains/job-experience/model/mock";
import type { JobExperience } from "@/domains/job-experience/model/schema";
import contactPointsMock from "@/domains/contact-point/model/mock";
import type { ContactPointsModel } from "@/domains/contact-point/model/schema";
import profilesMock from "@/domains/profile/model/mock";
import type { ProfilesModel } from "@/domains/profile/model/schema";

type MemoryStore = {
  jobExperiences: JobExperience[];
  contactPoints: ContactPointsModel;
  profiles: ProfilesModel;
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const buildInitialStore = (): MemoryStore => ({
  jobExperiences: clone(jobExperiencesMock),
  contactPoints: clone(contactPointsMock),
  profiles: clone(profilesMock),
});

let store = buildInitialStore();

export const memoryStore = {
  reset(): void {
    store = buildInitialStore();
  },
  getJobExperiences(): JobExperience[] {
    return clone(store.jobExperiences);
  },
  getContactPoints(): ContactPointsModel {
    return clone(store.contactPoints);
  },
  getProfiles(): ProfilesModel {
    return clone(store.profiles);
  },
};
