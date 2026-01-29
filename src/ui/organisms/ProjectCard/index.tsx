import "./styles.css";

import { FeaturedProjectCard } from "./variants/Featured";
import { GridProjectCard } from "./variants/Grid";
import type { ProjectCardProps } from "./ProjectCard.types";

// Re-export types for convenience
export type {
  ProjectCardProps,
  TechStackIconsProps,
  ActionLinksProps,
} from "./ProjectCard.types";

// Re-export subcomponents for direct use if needed
export { TechStackIcons } from "./TechStackIcons";
export { ActionLinks } from "./ActionLinks";
export { FeaturedProjectCard } from "./variants/Featured";
export { GridProjectCard } from "./variants/Grid";

/**
 * ProjectCard component that automatically selects the appropriate variant
 * based on the project's `featured` flag.
 *
 * @example
 * ```tsx
 * // Auto-selects variant based on project.featured
 * <ProjectCard project={project} />
 *
 * // Or use variants directly
 * <FeaturedProjectCard project={project} />
 * <GridProjectCard project={project} />
 * ```
 */
export function ProjectCard({ project, className }: ProjectCardProps) {
  if (project.featured) {
    return <FeaturedProjectCard project={project} className={className} />;
  }

  return <GridProjectCard project={project} className={className} />;
}

// Default export for simpler imports
export default ProjectCard;
