import Link from "next/link";
import { GitHubIcon, ArrowIcon } from "@/atoms/icons";
import type { ActionLinksProps } from "./ProjectCard.types";

/**
 * Displays action links for a project (GitHub repository and demo).
 * Links are always in DOM for accessibility but may be styled for hover visibility.
 */
export function ActionLinks({
  demo,
  repository,
  projectTitle,
  className = "",
}: ActionLinksProps) {
  const hasLinks = demo || repository;

  if (!hasLinks) {
    return null;
  }

  return (
    <div className={`project-card__actions ${className}`.trim()}>
      {repository && (
        <Link
          href={repository}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__action-link project-card__action-link--repo"
          aria-label={`View source code for ${projectTitle} on GitHub`}
        >
          <GitHubIcon aria-hidden="true" />
          <span className="project-card__action-text">Code</span>
        </Link>
      )}
      {demo && (
        <Link
          href={demo}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__action-link project-card__action-link--demo"
          aria-label={`View live demo of ${projectTitle}`}
        >
          <ArrowIcon aria-hidden="true" />
          <span className="project-card__action-text">Demo</span>
        </Link>
      )}
    </div>
  );
}
