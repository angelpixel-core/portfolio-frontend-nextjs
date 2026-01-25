import {
  JobExperienceSchema,
  JobExperienceTaskSchema,
  JobExperiencesSchema,
  type JobExperience,
  type JobExperienceTask,
} from "../schema";
import jobExperiencesMock from "../mock";

describe("JobExperienceTaskSchema", () => {
  it("validates a task with description only", () => {
    const task = { description: "Collaborated with CTOs and Product Owners" };
    const result = JobExperienceTaskSchema.safeParse(task);
    expect(result.success).toBe(true);
  });

  it("validates a task with description and tags", () => {
    const task: JobExperienceTask = {
      description: "Enhanced platform with new features",
      tags: ["features", "integrations", "scaling"],
    };
    const result = JobExperienceTaskSchema.safeParse(task);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["features", "integrations", "scaling"]);
    }
  });

  it("rejects a task without description", () => {
    const task = { tags: ["some", "tags"] };
    const result = JobExperienceTaskSchema.safeParse(task);
    expect(result.success).toBe(false);
  });
});

describe("JobExperienceSchema", () => {
  const validExperience: JobExperience = {
    id: 1,
    position: "FullStack Engineer",
    company: "Compass",
    companyLink: "https://compass.com",
    time: "Dec 2021 - Aug 2022",
    address: "New York, United States",
    work: [
      {
        description: "Code maintenance and enhancement",
        tags: ["code maintenance", "enhancement"],
      },
    ],
  };

  it("validates a complete job experience", () => {
    const result = JobExperienceSchema.safeParse(validExperience);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.position).toBe("FullStack Engineer");
      expect(result.data.company).toBe("Compass");
    }
  });

  it("validates a job experience without work tasks", () => {
    const experienceWithoutWork = {
      id: 2,
      position: "Software Engineer",
      company: "SouthWorks",
      companyLink: "https://www.southworks.com",
      time: "May 2020 - Sept 2021",
      address: "Delaware, United States",
    };
    const result = JobExperienceSchema.safeParse(experienceWithoutWork);
    expect(result.success).toBe(true);
  });

  it("rejects an experience with invalid URL", () => {
    const invalidExperience = {
      ...validExperience,
      companyLink: "not-a-valid-url",
    };
    const result = JobExperienceSchema.safeParse(invalidExperience);
    expect(result.success).toBe(false);
  });

  it("rejects an experience missing required fields", () => {
    const incompleteExperience = {
      id: 1,
      position: "Engineer",
      // missing company, companyLink, time, address
    };
    const result = JobExperienceSchema.safeParse(incompleteExperience);
    expect(result.success).toBe(false);
  });

  it("rejects an experience with invalid id type", () => {
    const invalidIdExperience = {
      ...validExperience,
      id: "not-a-number",
    };
    const result = JobExperienceSchema.safeParse(invalidIdExperience);
    expect(result.success).toBe(false);
  });
});

describe("JobExperiencesSchema", () => {
  it("validates an array of job experiences", () => {
    const experiences: JobExperience[] = [
      {
        id: 1,
        position: "Independent",
        company: "Consulting Service",
        companyLink: "https://site.dev",
        time: "Feb 2023 - Dec 2023",
        address: "Remote",
      },
      {
        id: 2,
        position: "FullStack Engineer",
        company: "Compass",
        companyLink: "https://compass.com",
        time: "Dec 2021 - Aug 2022",
        address: "New York, United States",
      },
    ];
    const result = JobExperiencesSchema.safeParse(experiences);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(2);
    }
  });

  it("validates an empty array", () => {
    const result = JobExperiencesSchema.safeParse([]);
    expect(result.success).toBe(true);
  });

  it("rejects if any experience is invalid", () => {
    const mixedExperiences = [
      {
        id: 1,
        position: "Valid",
        company: "Company",
        companyLink: "https://valid.com",
        time: "2023",
        address: "Remote",
      },
      {
        id: 2,
        position: "Invalid",
        // missing required fields
      },
    ];
    const result = JobExperiencesSchema.safeParse(mixedExperiences);
    expect(result.success).toBe(false);
  });

  it("validates the mock data from backend.rb", () => {
    const result = JobExperiencesSchema.safeParse(jobExperiencesMock);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveLength(6);
      // Verify reverse chronological order (newest first)
      expect(result.data[0].company).toBe("Consulting Service");
      expect(result.data[5].company).toBe("UNLP");
    }
  });
});
