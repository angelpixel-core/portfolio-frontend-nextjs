"use client";

import "./styles.css";

import { ParagraphText } from "@/atoms/texts";
import { BiographySkeleton } from "./skeletons";
import useProfile from "@/domains/profile/queries";

/**
 * Biography Component
 * Displays profile biography text as flowing paragraphs.
 *
 * @param {boolean} showTitle - Whether to show "Biography" heading (default: false)
 */
const Biography = ({ showTitle = false }) => {
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
        <div className="biography_fallback" data-testid="biography-fallback">
          <span className="biography_fallback-text">
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
        <ParagraphText key={idx} text={row} />
      ))}
    </>
  );
};

export default Biography;
