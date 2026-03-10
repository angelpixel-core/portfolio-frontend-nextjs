import type { MouseEvent } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/ui";
import type { ActionLinksProps } from "./ProjectCard.types";

/**
 * Displays semantic action links for a project.
 */
export function ActionLinks({
  architectureTarget,
  demo,
  repository,
  projectTitle,
  onOpenArchitecture,
  isTouched = false,
  variant = "grid",
  className = "",
}: ActionLinksProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasArchitecture = Boolean(architectureTarget?.image);
  const hasSourceCode = isUsableExternalTarget(repository);
  const hasLiveDemo = isUsableExternalTarget(demo);
  const hasLinks = hasArchitecture || hasSourceCode || hasLiveDemo;

  if (!hasLinks) {
    return null;
  }

  const visibilityClass =
    isTouched || shouldReduceMotion ? "project-card__actions--visible" : "";

  const variantClass = `project-card__actions--${variant}`;

  const handleArchitectureClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onOpenArchitecture?.();
  };

  return (
    <div
      className={`project-card__actions ${variantClass} ${visibilityClass} ${className}`.trim()}
      data-testid="project-card-actions"
    >
      {hasArchitecture ? (
        <button
          type="button"
          className="project-card__action-link project-card__action-link--architecture"
          onClick={handleArchitectureClick}
          aria-label={`Open architecture view for ${projectTitle}`}
          data-testid="project-card-action-architecture"
        >
          Architecture
        </button>
      ) : null}

      {hasSourceCode ? (
        <Link
          href={repository!}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__action-link project-card__action-link--source"
          aria-label={`Open source code for ${projectTitle}`}
          data-testid="project-card-action-source"
        >
          Source Code
        </Link>
      ) : null}

      {hasLiveDemo ? (
        <Link
          href={demo!}
          target="_blank"
          rel="noopener noreferrer"
          className="project-card__action-link project-card__action-link--demo"
          aria-label={`Open live demo for ${projectTitle}`}
          data-testid="project-card-action-demo"
        >
          Live Demo
        </Link>
      ) : null}
    </div>
  );
}

function isUsableExternalTarget(target?: string): boolean {
  if (!target) {
    return false;
  }

  try {
    const parsed = new URL(target);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
