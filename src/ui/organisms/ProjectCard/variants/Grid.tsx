import React from "react";
import Link from "next/link";
import { BoxShadow } from "@/atoms/shadows";
import { FramerImage } from "@/atoms/hocs";
import { useTouchState } from "@/hooks/ui";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";
import type { ProjectCardVariantProps } from "../ProjectCard.types";

/**
 * Grid variant of ProjectCard for non-featured projects.
 * Displays a compact card suitable for grid layouts.
 *
 * Touch behavior:
 * - Single tap reveals action links (GitHub/Demo)
 * - Tap elsewhere dismisses touched state
 * - Only one card can be touched at a time
 * - Disabled during page transitions
 */
export function GridProjectCard({
  project,
  className = "",
}: ProjectCardVariantProps) {
  const { slug, title, img, tags, technologies, demo, repository } = project;
  const detailUrl = `/projects/${slug}`;

  // Touch state management for mobile interactions
  const { isTouched, handleTouchStart, handleClick, elementRef } =
    useTouchState({ id: `grid-project-${slug}` });

  const touchedClass = isTouched ? "project-card--touched" : "";

  return (
    <article
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`project-card project-card--grid ${touchedClass} ${className}`.trim()}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      data-testid="project-card-grid"
    >
      <BoxShadow />

      <Link
        href={detailUrl}
        className="project-card__image-link"
        data-testid="project-card-image-link"
      >
        <FramerImage
          src={img}
          alt={title}
          width={600}
          height={400}
          className="project-card__image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          data-testid="project-card-image"
        />

        <TechStackIcons
          technologies={technologies}
          variant="grid"
          className="project-card__tech-stack--floating-minimal"
        />
      </Link>

      <div className="project-card__content" data-testid="project-card-content">
        <span
          className="project-card__tags project-card__context-line"
          data-testid="project-card-tags"
        >
          {tags}
        </span>

        <Link href={detailUrl} className="project-card__title-link">
          <h2 className="project-card__title" data-testid="project-card-title">
            {title}
          </h2>
        </Link>

        <ActionLinks
          demo={demo}
          repository={repository}
          projectTitle={title}
          isTouched={isTouched}
          variant="grid"
        />
      </div>
    </article>
  );
}
