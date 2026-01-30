import Link from "next/link";
import { GitHubIcon, ArrowIcon } from "@/atoms/icons";
import { useReducedMotion } from "@/hooks/ui";
import type { ActionLinksProps } from "./ProjectCard.types";

/**
 * Displays action links for a project (GitHub repository and demo).
 * Links are always in DOM for accessibility.
 *
 * Visibility behavior:
 * - Desktop: Visible on hover (CSS-controlled)
 * - Mobile: Visible when parent card is touched (isTouched prop)
 * - Reduced motion: Always visible (no animation required)
 */
export function ActionLinks({
  demo,
  repository,
  projectTitle,
  isTouched = false,
  className = "",
}: ActionLinksProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasLinks = demo || repository;

  if (!hasLinks) {
    return null;
  }

  // Show links when touched (mobile), or when reduced motion is enabled
  const visibilityClass =
    isTouched || shouldReduceMotion ? "project-card__actions--visible" : "";

  return (
    <div
      className={`project-card__actions ${visibilityClass} ${className}`.trim()}
    >
      {repository && (
        <Link
          href={repository}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__action-link project-card__action-link--repo"
          aria-label={`View source code for ${projectTitle} on GitHub`}
        >
          <GitHubIcon className="" aria-hidden="true" />
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
          <ArrowIcon className="" aria-hidden="true" />
          <span className="project-card__action-text">Demo</span>
        </Link>
      )}
    </div>
  );
}
