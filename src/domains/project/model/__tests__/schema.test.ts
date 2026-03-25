import { ProjectSchema, ProjectsSchema } from "../schema";
import type { ProjectModel } from "../schema";

describe("ProjectSchema", () => {
  const validProject = {
    id: 1,
    slug: "crypto-screener",
    title: "Crypto Screener Application",
    summary: "A feature-rich Crypto Screener App using React.",
    description:
      "This comprehensive cryptocurrency screening application provides real-time market data analysis.",
    technologies: ["React", "Tailwind CSS", "JavaScript"],
    outcomes:
      "Achieved 50% faster load times compared to similar apps through optimized data fetching.",
    demo: "https://crypto-screener-demo.com",
    repository: "https://github.com/user/crypto-screener",
    img: "/images/projects/crypto-screener.jpg",
    screenshots: [
      "/images/projects/crypto-screener-1.jpg",
      "/images/projects/crypto-screener-2.jpg",
    ],
    tags: "Back Office • JavaScript • React",
    featured: true,
    visible: true,
    priority: 10,
    status: "live",
  };

  it("validates a valid project object with all fields", () => {
    expect(() => ProjectSchema.parse(validProject)).not.toThrow();
  });

  it("returns typed project data", () => {
    const result: ProjectModel = ProjectSchema.parse(validProject);
    expect(result.title).toBe("Crypto Screener Application");
    expect(result.featured).toBe(true);
    expect(result.id).toBe(1);
    expect(result.slug).toBe("crypto-screener");
    expect(result.description).toContain("comprehensive cryptocurrency");
    expect(result.technologies).toEqual([
      "React",
      "Tailwind CSS",
      "JavaScript",
    ]);
    expect(result.outcomes).toContain("50% faster");
    expect(result.screenshots).toHaveLength(2);
  });

  it("validates required fields", () => {
    const invalidProject = {
      id: 1,
      title: "Test",
      // missing required fields: slug, summary, description, technologies, img, tags, featured
    };
    expect(() => ProjectSchema.parse(invalidProject)).toThrow();
  });

  it("validates slug is required", () => {
    const projectWithoutSlug = {
      ...validProject,
      slug: undefined,
    };
    expect(() => ProjectSchema.parse(projectWithoutSlug)).toThrow();
  });

  it("validates description is required", () => {
    const projectWithoutDescription = {
      ...validProject,
      description: undefined,
    };
    expect(() => ProjectSchema.parse(projectWithoutDescription)).toThrow();
  });

  it("validates technologies is required and must be array", () => {
    const projectWithoutTech = {
      ...validProject,
      technologies: undefined,
    };
    expect(() => ProjectSchema.parse(projectWithoutTech)).toThrow();

    const projectWithInvalidTech = {
      ...validProject,
      technologies: "React, JavaScript", // string instead of array
    };
    expect(() => ProjectSchema.parse(projectWithInvalidTech)).toThrow();
  });

  it("validates technologies array contains strings", () => {
    const projectWithValidTech = {
      ...validProject,
      technologies: ["React", "TypeScript"],
    };
    expect(() => ProjectSchema.parse(projectWithValidTech)).not.toThrow();

    const projectWithInvalidTechItems = {
      ...validProject,
      technologies: [1, 2, 3], // numbers instead of strings
    };
    expect(() => ProjectSchema.parse(projectWithInvalidTechItems)).toThrow();
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
      slug: "test-project",
      title: "Test Project",
      summary: "A test project",
      description: "Full description of the test project.",
      technologies: ["React"],
      img: "/images/test.jpg",
      tags: "Test",
      featured: false,
      visible: true,
      priority: 2,
      status: "live",
      // demo is intentionally omitted (optional)
    };
    expect(() => ProjectSchema.parse(projectWithoutDemo)).not.toThrow();
  });

  it("validates optional repository field can be undefined", () => {
    const projectWithoutRepo = {
      id: 3,
      slug: "private-project",
      title: "Private Project",
      summary: "A project without public repo",
      description: "Full description of the private project.",
      technologies: ["Node.js"],
      demo: "https://private-demo.com",
      img: "/images/private.jpg",
      tags: "Private",
      featured: false,
      visible: true,
      priority: 3,
      status: "live",
      // repository is intentionally omitted (optional)
    };
    expect(() => ProjectSchema.parse(projectWithoutRepo)).not.toThrow();
  });

  it("validates optional outcomes field can be undefined", () => {
    const projectWithoutOutcomes = {
      ...validProject,
      outcomes: undefined,
    };
    delete (projectWithoutOutcomes as Record<string, unknown>).outcomes;
    expect(() => ProjectSchema.parse(projectWithoutOutcomes)).not.toThrow();
  });

  it("validates optional screenshots field can be undefined", () => {
    const projectWithoutScreenshots = {
      ...validProject,
      screenshots: undefined,
    };
    delete (projectWithoutScreenshots as Record<string, unknown>).screenshots;
    expect(() => ProjectSchema.parse(projectWithoutScreenshots)).not.toThrow();
  });

  it("validates screenshots must be an array of strings", () => {
    const projectWithValidScreenshots = {
      ...validProject,
      screenshots: ["/img1.jpg", "/img2.jpg"],
    };
    expect(() =>
      ProjectSchema.parse(projectWithValidScreenshots)
    ).not.toThrow();

    const projectWithInvalidScreenshots = {
      ...validProject,
      screenshots: "/single-screenshot.jpg", // string instead of array
    };
    expect(() => ProjectSchema.parse(projectWithInvalidScreenshots)).toThrow();
  });

  it("validates both demo and repository can be undefined", () => {
    const projectWithoutLinks = {
      id: 4,
      slug: "closed-project",
      title: "Closed Project",
      summary: "A project without demo or repo",
      description: "Full description of the closed project.",
      technologies: ["Python"],
      img: "/images/closed.jpg",
      tags: "Archived",
      featured: false,
      visible: true,
      priority: 4,
      status: "live",
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

  it("validates visible is required", () => {
    const projectWithoutVisible = {
      ...validProject,
      visible: undefined,
    };
    expect(() => ProjectSchema.parse(projectWithoutVisible)).toThrow();
  });

  it("validates visible must be a boolean", () => {
    const projectWithInvalidVisible = {
      ...validProject,
      visible: "true",
    };
    expect(() => ProjectSchema.parse(projectWithInvalidVisible)).toThrow();
  });

  it("validates priority is required", () => {
    const projectWithoutPriority = {
      ...validProject,
      priority: undefined,
    };
    expect(() => ProjectSchema.parse(projectWithoutPriority)).toThrow();
  });

  it("validates priority must be a number", () => {
    const projectWithInvalidPriority = {
      ...validProject,
      priority: "high",
    };
    expect(() => ProjectSchema.parse(projectWithInvalidPriority)).toThrow();
  });

  it("accepts optional featured ribbon metadata", () => {
    const projectWithRibbon = {
      ...validProject,
      featuredCard: {
        ribbon: {
          text: "Work in Progress",
          variant: "wip",
        },
      },
    };

    expect(() => ProjectSchema.parse(projectWithRibbon)).not.toThrow();
  });

  it("rejects featured ribbon when text is empty", () => {
    const projectWithEmptyRibbonText = {
      ...validProject,
      featuredCard: {
        ribbon: {
          text: "   ",
          variant: "planned",
        },
      },
    };

    expect(() => ProjectSchema.parse(projectWithEmptyRibbonText)).toThrow();
  });

  it("rejects featured ribbon with unsupported variant", () => {
    const projectWithInvalidRibbonVariant = {
      ...validProject,
      featuredCard: {
        ribbon: {
          text: "Coming Soon",
          variant: "coming-soon",
        },
      },
    };

    expect(() =>
      ProjectSchema.parse(projectWithInvalidRibbonVariant)
    ).toThrow();
  });
});

describe("ProjectsSchema", () => {
  it("validates an array of projects", () => {
    const projects = [
      {
        id: 1,
        slug: "project-1",
        title: "Project 1",
        summary: "Summary 1",
        description: "Description 1",
        technologies: ["React"],
        demo: "https://demo1.com",
        repository: "https://github.com/user/project1",
        img: "/images/p1.jpg",
        tags: "Tag1",
        featured: true,
        visible: true,
        priority: 2,
        status: "live",
      },
      {
        id: 2,
        slug: "project-2",
        title: "Project 2",
        summary: "Summary 2",
        description: "Description 2",
        technologies: ["Vue"],
        img: "/images/p2.jpg",
        tags: "Tag2",
        featured: false,
        visible: false,
        priority: 1,
        status: "live",
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
