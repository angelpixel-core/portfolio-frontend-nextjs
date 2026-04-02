import type { MouseEvent } from "react";
import Link from "next/link";
import GitHubIcon from "@/atoms/icons/GitHubIcon";
import { useReducedMotion } from "@/hooks/ui";
import { trackEvent } from "@/services/analytics";
import type { ActionLinksProps } from "./ProjectCard.types";

/**
 * Displays semantic action links for a project.
 */
export function ActionLinks({
  architectureTarget,
  demo,
  repository,
  allowSourceLink = false,
  allowDemoLink = false,
  projectTitle,
  onOpenArchitecture,
  isTouched = false,
  variant = "grid",
  className = "",
}: ActionLinksProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasArchitecture = Boolean(architectureTarget?.image);
  const hasSourceCode = isUsableExternalTarget(repository);
  const hasSourceLink = hasSourceCode && allowSourceLink;
  const hasLiveDemo = isUsableExternalTarget(demo);
  const hasDemoLink = hasLiveDemo && allowDemoLink;
  const hasLinks = hasArchitecture || hasSourceCode || hasLiveDemo;

  if (!hasLinks) {
    return null;
  }

  const visibilityClass =
    isTouched || shouldReduceMotion ? "project-card__actions--visible" : "";

  const variantClass = `project-card__actions--${variant}`;
  const isSourceIcon = variant === "featured" || variant === "grid";

  const handleArchitectureClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    trackEvent("project_architecture_click", {
      label: projectTitle,
    });
    onOpenArchitecture?.();
  };

  const handleDemoClick = () => {
    if (!demo) return;
    trackEvent("project_demo_click", { href: demo, label: projectTitle });
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
          Explore System
        </button>
      ) : null}

      {hasSourceCode ? (
        hasSourceLink ? (
          <Link
            href={repository!}
            target="_blank"
            rel="noopener noreferrer"
            className={`project-card__action-link project-card__action-link--source ${
              isSourceIcon ? "project-card__action-link--source-icon" : ""
            }`.trim()}
            aria-label={`Open source code for ${projectTitle}`}
            data-testid="project-card-action-source"
          >
            {isSourceIcon ? (
              <GitHubIcon className="project-card__action-icon" />
            ) : (
              "Source Code"
            )}
          </Link>
        ) : (
          <span
            className={`project-card__action-link project-card__action-link--source project-card__action-link--disabled ${
              isSourceIcon ? "project-card__action-link--source-icon" : ""
            }`.trim()}
            role="link"
            tabIndex={-1}
            aria-label={`Source code unavailable for ${projectTitle}`}
            aria-disabled="true"
            data-testid="project-card-action-source"
          >
            {isSourceIcon ? (
              <GitHubIcon className="project-card__action-icon" />
            ) : (
              "Source Code"
            )}
          </span>
        )
      ) : null}

      {hasLiveDemo ? (
        hasDemoLink ? (
          <Link
            href={demo!}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__action-link project-card__action-link--demo project-card__action-link--demo-inverse"
            aria-label={`Open live demo for ${projectTitle}`}
            data-testid="project-card-action-demo"
            onClick={handleDemoClick}
          >
            Live Demo
          </Link>
        ) : (
          <span
            className="project-card__action-link project-card__action-link--demo project-card__action-link--demo-inverse project-card__action-link--disabled"
            role="link"
            tabIndex={-1}
            aria-label={`Live demo unavailable for ${projectTitle}`}
            aria-disabled="true"
            data-testid="project-card-action-demo"
          >
            Live Demo
          </span>
        )
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
