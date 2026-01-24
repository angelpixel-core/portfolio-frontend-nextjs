import { ProjectSchema, ProjectsSchema } from "../schema";
import type { ProjectModel } from "../schema";

describe("ProjectSchema", () => {
  const validProject = {
    id: 1,
    title: "Crypto Screener Application",
    summary: "A feature-rich Crypto Screener App using React.",
    demo: "https://crypto-screener-demo.com",
    repository: "https://github.com/user/crypto-screener",
    img: "/images/projects/crypto-screener.jpg",
    tags: "Back Office • JavaScript • React",
    featured: true,
  };

  it("validates a valid project object", () => {
    expect(() => ProjectSchema.parse(validProject)).not.toThrow();
  });

  it("returns typed project data", () => {
    const result: ProjectModel = ProjectSchema.parse(validProject);
    expect(result.title).toBe("Crypto Screener Application");
    expect(result.featured).toBe(true);
    expect(result.id).toBe(1);
  });

  it("validates required fields", () => {
    const invalidProject = {
      id: 1,
      title: "Test",
      // missing required fields: summary, img, tags, featured
    };
    expect(() => ProjectSchema.parse(invalidProject)).toThrow();
  });

  it("validates id must be a number", () => {
    const invalidId = {
      ...validProject,
      id: "not-a-number",
    };
    expect(() => ProjectSchema.parse(invalidId)).toThrow();
  });

  it("validates optional demo field accepts valid URL", () => {
    const projectWithDemo = {
      ...validProject,
      demo: "https://example.com/demo",
    };
    expect(() => ProjectSchema.parse(projectWithDemo)).not.toThrow();
  });

  it("validates optional demo field can be undefined", () => {
    const projectWithoutDemo = {
      id: 2,
      title: "Test Project",
      summary: "A test project",
      img: "/images/test.jpg",
      tags: "Test",
      featured: false,
      // demo is intentionally omitted (optional)
      repository: "https://github.com/user/test",
    };
    expect(() => ProjectSchema.parse(projectWithoutDemo)).not.toThrow();
  });

  it("validates optional repository field can be undefined", () => {
    const projectWithoutRepo = {
      id: 3,
      title: "Private Project",
      summary: "A project without public repo",
      demo: "https://private-demo.com",
      img: "/images/private.jpg",
      tags: "Private",
      featured: false,
      // repository is intentionally omitted (optional)
    };
    expect(() => ProjectSchema.parse(projectWithoutRepo)).not.toThrow();
  });

  it("validates both demo and repository can be undefined", () => {
    const projectWithoutLinks = {
      id: 4,
      title: "Closed Project",
      summary: "A project without demo or repo",
      img: "/images/closed.jpg",
      tags: "Archived",
      featured: false,
      // both demo and repository are intentionally omitted
    };
    expect(() => ProjectSchema.parse(projectWithoutLinks)).not.toThrow();
  });

  it("rejects invalid URL for demo", () => {
    const invalidDemo = {
      ...validProject,
      demo: "not-a-url",
    };
    expect(() => ProjectSchema.parse(invalidDemo)).toThrow();
  });

  it("rejects invalid URL for repository", () => {
    const invalidRepo = {
      ...validProject,
      repository: "not-a-url",
    };
    expect(() => ProjectSchema.parse(invalidRepo)).toThrow();
  });

  it("validates featured must be a boolean", () => {
    const invalidFeatured = {
      ...validProject,
      featured: "yes",
    };
    expect(() => ProjectSchema.parse(invalidFeatured)).toThrow();
  });
});

describe("ProjectsSchema", () => {
  it("validates an array of projects", () => {
    const projects = [
      {
        id: 1,
        title: "Project 1",
        summary: "Summary 1",
        demo: "https://demo1.com",
        repository: "https://github.com/user/project1",
        img: "/images/p1.jpg",
        tags: "Tag1",
        featured: true,
      },
      {
        id: 2,
        title: "Project 2",
        summary: "Summary 2",
        img: "/images/p2.jpg",
        tags: "Tag2",
        featured: false,
        // demo and repository omitted (optional)
      },
    ];
    expect(() => ProjectsSchema.parse(projects)).not.toThrow();
  });

  it("rejects non-array input", () => {
    expect(() => ProjectsSchema.parse({ id: 1 })).toThrow();
  });

  it("validates empty array", () => {
    expect(() => ProjectsSchema.parse([])).not.toThrow();
  });
});
