/**
 * Project Data Validation Test
 *
 * This test validates the actual project mock data against the schema.
 * Run with: npm run validate:projects
 *
 * @see docs/content-management.md
 */

import { ProjectsSchema } from "../schema";
import projectsMock from "../mock";

describe("Project Data Validation", () => {
  it("validates all projects in mock data", () => {
    expect(() => ProjectsSchema.parse(projectsMock)).not.toThrow();
  });

  it("has at least one project", () => {
    expect(projectsMock.length).toBeGreaterThan(0);
  });

  it("has unique IDs for all projects", () => {
    const ids = projectsMock.map((p) => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("has unique slugs for all projects", () => {
    const slugs = projectsMock.map((p) => p.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("has at least one featured project", () => {
    const featuredProjects = projectsMock.filter((p) => p.featured);
    expect(featuredProjects.length).toBeGreaterThan(0);
  });

  it("all projects have valid image paths", () => {
    projectsMock.forEach((project) => {
      expect(project.img).toMatch(/^\/images\/projects\//);
    });
  });

  it("all projects have at least one technology", () => {
    projectsMock.forEach((project) => {
      expect(project.technologies.length).toBeGreaterThan(0);
    });
  });

  it("all projects have numeric priority", () => {
    projectsMock.forEach((project) => {
      expect(typeof project.priority).toBe("number");
    });
  });
});
