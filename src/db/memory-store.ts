import jobExperiencesMock from "@/domains/job-experience/model/mock";
import type { JobExperience } from "@/domains/job-experience/model/schema";
import projectsMock from "@/domains/project/model/mock";
import type { ProjectModel } from "@/domains/project/model/schema";
import contactPointsMock from "@/domains/contact-point/model/mock";
import type { ContactPointsModel } from "@/domains/contact-point/model/schema";
import profilesMock from "@/domains/profile/model/mock";
import type { ProfilesModel } from "@/domains/profile/model/schema";
import articlesMock from "@/domains/article/model/mock";
import type { Article } from "@/domains/article/model/schema";
import wordCloudConceptsMock from "@/domains/word-cloud/model/mock";
import type { Concept } from "@/domains/word-cloud/model/schema";

type MemoryStore = {
  jobExperiences: JobExperience[];
  projects: ProjectModel[];
  contactPoints: ContactPointsModel;
  profiles: ProfilesModel;
  articles: Article[];
  wordCloudConcepts: Concept[];
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const buildInitialStore = (): MemoryStore => ({
  jobExperiences: clone(jobExperiencesMock),
  projects: clone(projectsMock),
  contactPoints: clone(contactPointsMock),
  profiles: clone(profilesMock),
  articles: clone(articlesMock),
  wordCloudConcepts: clone(wordCloudConceptsMock),
});

let store = buildInitialStore();

export const memoryStore = {
  reset(): void {
    store = buildInitialStore();
  },
  getJobExperiences(): JobExperience[] {
    return clone(store.jobExperiences);
  },
  setJobExperiences(next: JobExperience[]): void {
    store.jobExperiences = clone(next);
  },
  getProjects(): ProjectModel[] {
    return clone(store.projects);
  },
  setProjects(next: ProjectModel[]): void {
    store.projects = clone(next);
  },
  getContactPoints(): ContactPointsModel {
    return clone(store.contactPoints);
  },
  getProfiles(): ProfilesModel {
    return clone(store.profiles);
  },
  getArticles(): Article[] {
    return clone(store.articles);
  },
  setArticles(next: Article[]): void {
    store.articles = clone(next);
  },
  getWordCloudConcepts(): Concept[] {
    return clone(store.wordCloudConcepts);
  },
  setWordCloudConcepts(next: Concept[]): void {
    store.wordCloudConcepts = clone(next);
  },
};
