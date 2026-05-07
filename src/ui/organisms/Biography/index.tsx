"use client";

import React from "react";

import "./styles.css";

import { FeaturedBoxShadow } from "@/atoms/shadows";
import Hero from "@/molecules/Hero";
import { ParagraphText } from "@/atoms/texts";
import { BiographySkeleton } from "./skeletons";
import { useProfile } from "@/domains/profile/queries";

interface BiographyProps {
  showTitle?: boolean;
  maxParagraphs?: number;
  showMobileHero?: boolean;
  startIndex?: number;
  fallbackText?: string;
}

/**
 * Biography Component
 * Displays profile biography text as flowing paragraphs.
 *
 * @param {boolean} showTitle - Whether to show "Biography" heading (default: false)
 */
const Biography = ({
  showTitle = false,
  maxParagraphs,
  showMobileHero = true,
  startIndex = 0,
  fallbackText,
}: BiographyProps): React.JSX.Element => {
  const { data: profile, isLoading, isError } = useProfile(1);

  if (isLoading) {
    const skeletonLines = startIndex === 0 ? 2 : 3;

    return (
      <>
        {showTitle && <h2 className="biography-title">biography</h2>}
        <BiographySkeleton
          lines={skeletonLines}
          showMobileHero={showMobileHero && startIndex === 0}
        />
      </>
    );
  }

  if (isError || !profile?.biography) {
    return (
      <>
        {showTitle && <h2 className="biography-title">biography</h2>}
        <div className="biography__fallback" data-testid="biography-fallback">
          <span className="biography__fallback-text">
            Biography currently unavailable
          </span>
        </div>
      </>
    );
  }

  const start = Math.max(0, startIndex);
  const end =
    typeof maxParagraphs === "number"
      ? start + Math.max(0, maxParagraphs)
      : undefined;
  const biographyRows = profile.biography.slice(start, end);
  const rowsToRender =
    biographyRows.length > 0
      ? biographyRows
      : fallbackText && fallbackText.trim().length > 0
        ? [fallbackText.trim()]
        : [];

  return (
    <>
      {showTitle && <h2 className="biography-title">biography</h2>}
      {rowsToRender.map((row, idx) => (
        <React.Fragment key={idx}>
          <ParagraphText
            text={row}
            className={`biography__paragraph${idx > 0 ? " biography__paragraph--extra" : ""}`}
          />

          {showMobileHero && idx === 0 && start === 0 && (
            <div
              className="biography__mobile-hero"
              data-testid="biography-mobile-hero"
            >
              <FeaturedBoxShadow />
              <div className="biography__mobile-hero-frame">
                <Hero
                  name="toon"
                  imageSrc="/images/about/hero.png"
                  size={260}
                  className="biography__mobile-hero-image"
                />
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default Biography;
