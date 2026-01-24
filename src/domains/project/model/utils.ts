import type { ProjectModel } from "./schema";

/**
 * Extract unique technologies from all projects, sorted alphabetically.
 * @param projects - Array of projects
 * @returns Sorted array of unique technology strings
 */
export function getUniqueTechnologies(projects: ProjectModel[]): string[] {
  const techSet = new Set<string>();

  projects.forEach((project) => {
    project.technologies.forEach((tech) => {
      techSet.add(tech);
    });
  });

  return Array.from(techSet).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );
}
