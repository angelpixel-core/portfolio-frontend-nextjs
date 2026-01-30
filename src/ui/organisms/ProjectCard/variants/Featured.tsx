import React from "react";
import Link from "next/link";
import { BoxShadow } from "@/atoms/shadows";
import { FramerImage } from "@/atoms/hocs";
import { useTouchState } from "@/hooks/ui";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";
import type { ProjectCardVariantProps } from "../ProjectCard.types";

/**
 * Featured variant of ProjectCard for highlighted projects.
 * Displays a larger card with summary text, suitable for blade layouts.
 *
 * Touch behavior:
 * - Single tap reveals action links (GitHub/Demo)
 * - Tap elsewhere dismisses touched state
 * - Only one card can be touched at a time
 * - Disabled during page transitions
 */
export function FeaturedProjectCard({
  project,
  className = "",
}: ProjectCardVariantProps) {
  const { slug, title, summary, img, tags, technologies, demo, repository } =
    project;
  const detailUrl = `/projects/${slug}`;

  // Touch state management for mobile interactions
  const { isTouched, handleTouchStart, handleClick, elementRef } =
    useTouchState({ id: `featured-project-${slug}` });

  const touchedClass = isTouched ? "project-card--touched" : "";

  return (
    <article
      ref={elementRef as React.RefObject<HTMLElement>}
      className={`project-card project-card--featured ${touchedClass} ${className}`.trim()}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
      data-testid="project-card-featured"
    >
      <BoxShadow />

      <Link
        href={detailUrl}
        className="project-card__image-link--featured"
        data-testid="project-card-image-link"
      >
        <FramerImage
          src={img}
          alt={title}
          width={800}
          height={450}
          className="project-card__image--featured"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
          data-testid="project-card-image"
        />
      </Link>

      <div
        className="project-card__content--featured"
        data-testid="project-card-content"
      >
        <span className="project-card__tags" data-testid="project-card-tags">
          {tags}
        </span>

        <Link href={detailUrl} className="project-card__title-link">
          <h2
            className="project-card__title--featured"
            data-testid="project-card-title"
          >
            {title}
          </h2>
        </Link>

        <p className="project-card__summary" data-testid="project-card-summary">
          {summary}
        </p>

        <TechStackIcons technologies={technologies} />

        <ActionLinks
          demo={demo}
          repository={repository}
          projectTitle={title}
          isTouched={isTouched}
        />
      </div>
    </article>
  );
}
