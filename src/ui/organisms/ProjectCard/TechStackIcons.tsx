import type { TechStackIconsProps } from "./ProjectCard.types";
import { getTechIcon } from "./utils/getTechIcon";

const DEFAULT_MAX_VISIBLE = 4;

/**
 * Displays technology stack icons for a project.
 * Shows a limited number of icons with an overflow indicator for additional technologies.
 */
export function TechStackIcons({
  technologies,
  maxVisible = DEFAULT_MAX_VISIBLE,
  className = "",
}: TechStackIconsProps) {
  if (!technologies || technologies.length === 0) {
    return null;
  }

  const visibleTechs = technologies.slice(0, maxVisible);
  const overflowCount = Math.max(0, technologies.length - maxVisible);

  return (
    <div
      className={`project-card__tech-stack ${className}`.trim()}
      role="list"
      aria-label="Technologies used"
      data-testid="project-card-tech-stack"
    >
      {visibleTechs.map((tech) => {
        const IconComponent = getTechIcon(tech);
        return (
          <span
            key={tech}
            className="project-card__tech-icon"
            role="listitem"
            aria-label={tech}
            title={tech}
          >
            <IconComponent aria-hidden="true" />
          </span>
        );
      })}
      {overflowCount > 0 && (
        <span
          className="project-card__tech-overflow"
          aria-label={`and ${overflowCount} more technologies`}
          title={technologies.slice(maxVisible).join(", ")}
        >
          +{overflowCount}
        </span>
      )}
    </div>
  );
}
