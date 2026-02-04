import type { TechStackIconsProps } from "./ProjectCard.types";
import { getTechIcon } from "./utils/getTechIcon";

/**
 * Displays technology stack icons for a project.
 */
export function TechStackIcons({
  technologies,
  className = "",
}: TechStackIconsProps) {
  if (!technologies || technologies.length === 0) {
    return null;
  }

  return (
    <div
      className={`project-card__tech-stack ${className}`.trim()}
      role="list"
      aria-label="Technologies used"
      data-testid="project-card-tech-stack"
    >
      {technologies.map((tech) => {
        const IconComponent = getTechIcon(tech);
        return (
          <span
            key={tech}
            className="project-card__tech-icon"
            role="listitem"
            aria-label={tech}
            title={tech}
          >
            <svg viewBox="0 0 128 128" aria-hidden="true">
              <IconComponent />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
