import { getUniqueTechnologies } from "../utils";
import type { ProjectModel } from "../schema";

describe("getUniqueTechnologies", () => {
  const mockProjects: ProjectModel[] = [
    {
      id: 1,
      slug: "project-1",
      title: "Project 1",
      summary: "Summary 1",
      description: "Description 1",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      img: "/img1.jpg",
      tags: "Tag1",
      featured: true,
    },
    {
      id: 2,
      slug: "project-2",
      title: "Project 2",
      summary: "Summary 2",
      description: "Description 2",
      technologies: ["Next.js", "React", "PostgreSQL"],
      img: "/img2.jpg",
      tags: "Tag2",
      featured: false,
    },
    {
      id: 3,
      slug: "project-3",
      title: "Project 3",
      summary: "Summary 3",
      description: "Description 3",
      technologies: ["Vue", "TypeScript"],
      img: "/img3.jpg",
      tags: "Tag3",
      featured: false,
    },
  ];

  it("returns unique technologies from all projects", () => {
    const result = getUniqueTechnologies(mockProjects);

    // Should not have duplicates
    expect(result).toContain("React");
    expect(result).toContain("TypeScript");
    expect(result.filter((t) => t === "React").length).toBe(1);
    expect(result.filter((t) => t === "TypeScript").length).toBe(1);
  });

  it("returns technologies sorted alphabetically (case-insensitive)", () => {
    const result = getUniqueTechnologies(mockProjects);

    expect(result).toEqual([
      "Next.js",
      "PostgreSQL",
      "React",
      "Tailwind CSS",
      "TypeScript",
      "Vue",
    ]);
  });

  it("returns empty array for empty projects array", () => {
    const result = getUniqueTechnologies([]);
    expect(result).toEqual([]);
  });

  it("returns empty array for projects with no technologies", () => {
    const emptyTechProjects: ProjectModel[] = [
      {
        id: 1,
        slug: "empty",
        title: "Empty",
        summary: "Summary",
        description: "Description",
        technologies: [],
        img: "/img.jpg",
        tags: "Tag",
        featured: false,
      },
    ];

    const result = getUniqueTechnologies(emptyTechProjects);
    expect(result).toEqual([]);
  });

  it("handles single project correctly", () => {
    const singleProject: ProjectModel[] = [
      {
        id: 1,
        slug: "single",
        title: "Single",
        summary: "Summary",
        description: "Description",
        technologies: ["React", "Node.js"],
        img: "/img.jpg",
        tags: "Tag",
        featured: false,
      },
    ];

    const result = getUniqueTechnologies(singleProject);
    expect(result).toEqual(["Node.js", "React"]);
  });
});
