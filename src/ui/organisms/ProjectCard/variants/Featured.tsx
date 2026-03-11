"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { BoxShadow } from "@/atoms/shadows";
import { FramerImage } from "@/atoms/hocs";
import { useTouchState } from "@/hooks/ui";
import { TechStackIcons } from "../TechStackIcons";
import { ActionLinks } from "../ActionLinks";
import ArchitectureOverlay from "../ArchitectureOverlay";
import ImageRibbon from "../ImageRibbon";
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
  const {
    slug,
    title,
    summary,
    description,
    img,
    screenshots,
    tags,
    technologies,
    demo,
    repository,
    featuredCard,
  } = project;
  const detailUrl = `/projects/${slug}`;
  const contextBadges =
    featuredCard?.contextBadges?.filter(Boolean) ??
    tags
      .split("•")
      .map((tag) => tag.trim())
      .filter(Boolean);
  const contextLine = contextBadges.join(" • ");
  const descriptionText = summary || description;
  const focusLine = featuredCard?.focusLine?.trim();
  const previewSrc = screenshots?.[0] || img;
  const hasPreview = Boolean(previewSrc);
  const ribbon = featuredCard?.ribbon;
  const architectureTarget =
    featuredCard?.architecture ??
    (hasPreview
      ? {
          image: previewSrc,
          alt: `Preview-based architecture placeholder for ${title}`,
          caption:
            "Architecture diagram pending. Using project preview as placeholder.",
        }
      : undefined);
  const [isArchitectureOpen, setArchitectureOpen] = useState(false);

  // Touch state management for mobile interactions
  const { isTouched, handleTouchStart, handleClick, elementRef } =
    useTouchState({ id: `featured-project-${slug}` });

  const touchedClass = isTouched ? "project-card--touched" : "";

  return (
    <>
      <article
        ref={elementRef as React.RefObject<HTMLElement>}
        className={`project-card project-card--featured ${touchedClass} ${className}`.trim()}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        data-testid="project-card-featured"
      >
        <BoxShadow />

        {hasPreview ? (
          <Link
            href={detailUrl}
            className="project-card__image-link--featured"
            data-testid="project-card-image-link"
          >
            <FramerImage
              src={previewSrc}
              alt={title}
              width={800}
              height={450}
              className="project-card__image--featured"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              data-testid="project-card-image"
            />

            {ribbon ? <ImageRibbon ribbon={ribbon} /> : null}

            <TechStackIcons
              technologies={technologies}
              variant="featured"
              className="project-card__tech-stack--floating-minimal"
            />
          </Link>
        ) : null}

        <div
          className="project-card__content--featured"
          data-testid="project-card-content"
        >
          {contextLine ? (
            <div
              className="project-card__context"
              data-testid="project-card-context"
            >
              <span className="project-card__tags project-card__context-line">
                {contextLine}
              </span>
            </div>
          ) : null}

          <Link href={detailUrl} className="project-card__title-link">
            <h2
              className="project-card__title--featured"
              data-testid="project-card-title"
            >
              {title}
            </h2>
          </Link>

          <p
            className="project-card__summary"
            data-testid="project-card-summary"
          >
            {descriptionText}
          </p>

          {focusLine ? (
            <p
              className="project-card__focus-line"
              data-testid="project-card-focus-line"
            >
              {focusLine}
            </p>
          ) : null}

          <ActionLinks
            architectureTarget={architectureTarget}
            demo={demo}
            repository={repository}
            projectTitle={title}
            onOpenArchitecture={() => setArchitectureOpen(true)}
            isTouched={isTouched}
            variant="featured"
          />
        </div>
      </article>

      {architectureTarget ? (
        <AnimatePresence>
          {isArchitectureOpen ? (
            <ArchitectureOverlay
              architecture={architectureTarget}
              isOpen={isArchitectureOpen}
              onRequestClose={() => setArchitectureOpen(false)}
              projectTitle={title}
            />
          ) : null}
        </AnimatePresence>
      ) : null}
    </>
  );
}
