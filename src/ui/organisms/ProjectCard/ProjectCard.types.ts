import type {
  ProjectArchitectureModel,
  ProjectFeaturedCardModel,
  ProjectFeaturedRibbonModel,
  ProjectFeaturedRibbonVariantModel,
  ProjectModel,
  ProjectStatusModel,
} from "@/domains/project/model/schema";

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
  /** Card variant - controls layout/alignment */
  variant?: "featured" | "grid";
  /** Optional class name */
  className?: string;
}

/**
 * Props for the ActionLinks subcomponent
 */
export interface ActionLinksProps {
  /** Architecture overlay target for featured cards */
  architectureTarget?: ProjectArchitectureModel;
  /** URL to the demo/live site */
  demo?: string;
  /** URL to the GitHub repository */
  repository?: string;
  /** Whether the source link is allowed to be clickable */
  allowSourceLink?: boolean;
  /** Whether the demo link is allowed to be clickable */
  allowDemoLink?: boolean;
  /** Project title for aria-labels */
  projectTitle: string;
  /** Callback to open architecture overlay */
  onOpenArchitecture?: () => void;
  /** Whether the parent card is in touched state (for mobile) */
  isTouched?: boolean;
  /** Card variant - affects layout order and labels */
  variant?: "featured" | "grid";
  /** Optional class name */
  className?: string;
}

/**
 * Props shared by both Featured and Grid variants
 */
export interface ProjectCardVariantProps {
  project: ProjectModel;
  featuredCard?: ProjectFeaturedCardModel;
  className?: string;
}

export interface ProjectImageRibbonProps {
  ribbon: ProjectFeaturedRibbonModel;
  className?: string;
}

export type ProjectImageRibbonVariant = ProjectFeaturedRibbonVariantModel;
export type ProjectStatus = ProjectStatusModel;
