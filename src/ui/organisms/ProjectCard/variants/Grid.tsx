"use client";

import React, { useState } from "react";
import Link from "next/link";
import Tilt from "react-parallax-tilt";
import { AnimatePresence } from "framer-motion";
import { BoxShadow } from "@/atoms/shadows";
import { FramerImage } from "@/atoms/hocs";
import { useTouchState } from "@/hooks/ui";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";
import ImageRibbon from "../ImageRibbon";
import ProjectTeaserOverlay from "../ProjectTeaserOverlay";
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
  const {
    slug,
    title,
    img,
    tags,
    technologies,
    demo,
    repository,
    featuredCard,
    status,
  } = project;
  const detailUrl = `/projects/${slug}`;
  const ribbon = featuredCard?.ribbon;
  const isLive = status === "live";
  const [isTeaserOpen, setTeaserOpen] = useState(false);

  // Touch state management for mobile interactions
  const { isTouched, handleTouchStart, handleClick, elementRef } =
    useTouchState({ id: `grid-project-${slug}` });

  const touchedClass = isTouched ? "project-card--touched" : "";
  const teaserClass = !isLive ? "project-card--teaser" : "";
  const imageContent = (
    <>
      <FramerImage
        src={img}
        alt={title}
        width={600}
        height={400}
        className="project-card__image"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        data-testid="project-card-image"
      />

      {ribbon ? <ImageRibbon ribbon={ribbon} /> : null}

      <TechStackIcons
        technologies={technologies}
        variant="grid"
        className="project-card__tech-stack--floating-minimal"
      />
    </>
  );

  const titleContent = (
    <h2 className="project-card__title" data-testid="project-card-title">
      {title}
    </h2>
  );

  const openTeaser = () => setTeaserOpen(true);
  const closeTeaser = () => setTeaserOpen(false);

  return (
    <>
      <Tilt
        className="project-card__tilt-wrapper"
        tiltMaxAngleX={6}
        tiltMaxAngleY={6}
        scale={1.02}
        transitionSpeed={800}
        glareEnable={false}
        gyroscope={false}
      >
        <article
          ref={elementRef as React.RefObject<HTMLElement>}
          className={`project-card project-card--grid ${touchedClass} ${teaserClass} ${className}`.trim()}
          onTouchStart={handleTouchStart}
          onClick={handleClick}
          data-testid="project-card-grid"
        >
          <BoxShadow />

          {isLive ? (
            <Link
              href={detailUrl}
              className="project-card__image-link"
              data-testid="project-card-image-link"
            >
              {imageContent}
            </Link>
          ) : (
            <button
              type="button"
              className="project-card__image-link project-card__teaser-trigger"
              data-testid="project-card-image-link"
              onClick={openTeaser}
              aria-haspopup="dialog"
            >
              {imageContent}
            </button>
          )}

          <div
            className="project-card__content"
            data-testid="project-card-content"
          >
            <span
              className="project-card__tags project-card__context-line"
              data-testid="project-card-tags"
            >
              {tags}
            </span>

            {isLive ? (
              <Link href={detailUrl} className="project-card__title-link">
                {titleContent}
              </Link>
            ) : (
              <button
                type="button"
                className="project-card__title-link project-card__teaser-trigger"
                onClick={openTeaser}
                aria-haspopup="dialog"
              >
                {titleContent}
              </button>
            )}

            <ActionLinks
              demo={demo}
              repository={repository}
              projectTitle={title}
              isTouched={isTouched}
              variant="grid"
            />
          </div>
        </article>
      </Tilt>

      {!isLive ? (
        <AnimatePresence>
          {isTeaserOpen ? (
            <ProjectTeaserOverlay
              isOpen={isTeaserOpen}
              onRequestClose={closeTeaser}
              projectTitle={title}
              projectStatus={status}
              projectSlug={slug}
            />
          ) : null}
        </AnimatePresence>
      ) : null}
    </>
  );
}
