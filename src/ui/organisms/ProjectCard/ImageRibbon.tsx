import type { ProjectImageRibbonProps } from "./ProjectCard.types";

const DEFAULT_VARIANT = "default";

export function ImageRibbon({
  ribbon,
  className = "",
}: ProjectImageRibbonProps) {
  const label = ribbon.text.trim();

  if (!label) {
    return null;
  }

  const variant = ribbon.variant ?? DEFAULT_VARIANT;

  return (
    <span
      className={`project-card__image-ribbon project-card__image-ribbon--${variant} ${className}`.trim()}
      data-testid="project-card-image-ribbon"
    >
      <span className="project-card__image-ribbon-text">{label}</span>
    </span>
  );
}

export default ImageRibbon;
