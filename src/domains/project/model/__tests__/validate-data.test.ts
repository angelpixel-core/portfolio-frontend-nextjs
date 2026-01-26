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

  // Display project summary for visual confirmation
  it("displays project summary", () => {
    console.log("\n📋 Project Data Summary:");
    console.log("========================");
    projectsMock.forEach((project, index) => {
      const featured = project.featured ? "⭐" : "  ";
      const demo = project.demo ? "🔗" : "  ";
      const repo = project.repository ? "📁" : "  ";
      console.log(
        `  ${index + 1}. ${featured} ${project.title} ${demo}${repo}`
      );
    });
    console.log("\nLegend: ⭐ Featured | 🔗 Demo | 📁 Repository\n");
    expect(true).toBe(true); // Always pass - this is for output only
  });
});
