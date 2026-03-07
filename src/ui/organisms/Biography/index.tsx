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
}

/**
 * Biography Component
 * Displays profile biography text as flowing paragraphs.
 *
 * @param {boolean} showTitle - Whether to show "Biography" heading (default: false)
 */
const Biography = ({
  showTitle = false,
}: BiographyProps): React.JSX.Element => {
  const { data: profile, isLoading, isError } = useProfile(1);

  if (isLoading) {
    return (
      <>
        {showTitle && <h2 className="biography-title">biography</h2>}
        <BiographySkeleton />
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

  return (
    <>
      {showTitle && <h2 className="biography-title">biography</h2>}
      {profile.biography.map((row, idx) => (
        <React.Fragment key={idx}>
          <ParagraphText
            text={row}
            className={`biography__paragraph${idx > 0 ? " biography__paragraph--extra" : ""}`}
          />

          {idx === 0 && (
            <div
              className="biography__mobile-hero"
              data-testid="biography-mobile-hero"
            >
              <FeaturedBoxShadow />
              <div className="biography__mobile-hero-frame">
                <Hero
                  name="toon"
                  imageSrc="/images/about/toon-tatoo.png"
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
