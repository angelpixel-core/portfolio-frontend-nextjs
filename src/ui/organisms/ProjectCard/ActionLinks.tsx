import Link from "next/link";
import { GitHubIcon } from "@/atoms/icons";
import { useReducedMotion } from "@/hooks/ui";
import type { ActionLinksProps } from "./ProjectCard.types";

/**
 * Displays action links for a project (GitHub repository and demo).
 *
 * Layout by variant:
 * - Featured: [GitHub icon] [Visit Project button]
 * - Grid: [Visit link] [GitHub icon]
 */
export function ActionLinks({
  demo,
  repository,
  projectTitle,
  isTouched = false,
  variant = "grid",
  className = "",
}: ActionLinksProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasLinks = demo || repository;

  if (!hasLinks) {
    return null;
  }

  const visibilityClass =
    isTouched || shouldReduceMotion ? "project-card__actions--visible" : "";

  const variantClass = `project-card__actions--${variant}`;

  // GitHub link component
  const githubLink = repository && (
    <Link
      href={repository}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card__action-link project-card__action-link--github"
      aria-label={`View source code for ${projectTitle} on GitHub`}
      data-testid="project-card-action-github"
    >
      <GitHubIcon className="" aria-hidden="true" />
    </Link>
  );

  // Visit link component
  const visitLink = demo && (
    <Link
      href={demo}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card__action-link project-card__action-link--visit"
      aria-label={`Visit ${projectTitle}`}
      data-testid="project-card-action-visit"
    >
      {variant === "featured" ? "Visit Project" : "Visit"}
    </Link>
  );

  return (
    <div
      className={`project-card__actions ${variantClass} ${visibilityClass} ${className}`.trim()}
      data-testid="project-card-actions"
    >
      {variant === "featured" ? (
        <>
          {githubLink}
          {visitLink}
        </>
      ) : (
        <>
          {visitLink}
          {githubLink}
        </>
      )}
    </div>
  );
}
