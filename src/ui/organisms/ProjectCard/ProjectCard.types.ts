import type { ProjectModel } from "@/domains/project/model/schema";

/**
 * Props for the ProjectCard component
 * Extends the domain model with presentation-specific options
 */
export interface ProjectCardProps {
  /** Project data from the domain model */
  project: ProjectModel;
  /** Optional class name for custom styling */
  className?: string;
}

/**
 * Props for the TechStackIcons subcomponent
 */
export interface TechStackIconsProps {
  /** Array of technology names */
  technologies: string[];
  /** Maximum number of icons to display before showing overflow */
  maxVisible?: number;
  /** Optional class name */
  className?: string;
}

/**
 * Props for the ActionLinks subcomponent
 */
export interface ActionLinksProps {
  /** URL to the demo/live site */
  demo?: string;
  /** URL to the GitHub repository */
  repository?: string;
  /** Project title for aria-labels */
  projectTitle: string;
  /** Whether the parent card is in touched state (for mobile) */
  isTouched?: boolean;
  /** Optional class name */
  className?: string;
}

/**
 * Props shared by both Featured and Grid variants
 */
export interface ProjectCardVariantProps {
  project: ProjectModel;
  className?: string;
}
