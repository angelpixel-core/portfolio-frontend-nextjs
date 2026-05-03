import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import {
  JobExperienceGroupSchema,
  JobExperiencesSchema,
  type JobExperience,
} from "./schema";

const ENDPOINT = "job-experiences";

interface FetchAllOptions {
  useMockFallback?: boolean;
}

interface LegacyJobExperienceRecord {
  id?: number;
  publish?: unknown;
  position?: string;
  company?: string;
  companyLink?: string;
  time?: string;
  year?: string;
  address?: string;
  contextBadges?: unknown;
  technologies?: unknown;
  group?: unknown;
  work?: unknown;
}

const YEAR_PATTERN = /\b\d{4}\b/g;

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === "string");
};

const normalizeLegacyExperience = (
  record: LegacyJobExperienceRecord
): JobExperience | null => {
  const yearFromTime =
    typeof record.time === "string"
      ? record.time.match(YEAR_PATTERN)?.[0]
      : undefined;
  const normalizedYear =
    typeof record.year === "string" && record.year.trim() !== ""
      ? record.year
      : (yearFromTime ?? "");
  const parsedGroup = JobExperienceGroupSchema.safeParse(record.group);

  if (!parsedGroup.success) {
    if (process.env.NODE_ENV !== "production") {
      logger.warn(
        "JobExperience",
        "Dropped legacy experience with invalid group",
        {
          id: record.id,
          group: record.group,
        }
      );
    }

    return null;
  }

  return {
    id: typeof record.id === "number" ? record.id : 0,
    publish: typeof record.publish === "boolean" ? record.publish : true,
    position: typeof record.position === "string" ? record.position : "",
    company: typeof record.company === "string" ? record.company : "",
    companyLink:
      typeof record.companyLink === "string" ? record.companyLink : "",
    time: typeof record.time === "string" ? record.time : "",
    year: normalizedYear,
    address: typeof record.address === "string" ? record.address : "",
    contextBadges: normalizeStringArray(record.contextBadges),
    technologies: normalizeStringArray(record.technologies),
    group: parsedGroup.data,
    work: Array.isArray(record.work) ? record.work : undefined,
  };
};

const normalizeLegacyExperiences = (data: unknown): JobExperience[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((record) =>
      normalizeLegacyExperience(record as LegacyJobExperienceRecord)
    )
    .filter((record): record is JobExperience => record !== null);
};

const JobExperienceModel = {
  async fetchAll({ useMockFallback = true }: FetchAllOptions = {}): Promise<
    JobExperience[]
  > {
    if (useMockFallback) {
      logger.mock("JobExperience", "job experiences", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Validate mock data at runtime
      const normalized = normalizeLegacyExperiences(mockData);
      const validated = JobExperiencesSchema.parse(normalized);
      return validated;
    }

    try {
      const data = await httpRequest(ENDPOINT);
      // Validate API response
      const normalized = normalizeLegacyExperiences(data);
      const validated = JobExperiencesSchema.parse(normalized);
      return validated;
    } catch (error) {
      logger.error("JobExperience", "fetchAll failed", error);
      throw error;
    }
  },
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
