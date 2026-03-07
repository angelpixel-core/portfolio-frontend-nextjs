"use client";

import React from "react";

import "./styles.css";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CircularText from "@/atoms/texts/CircularText";
import { useProfile } from "@/domains/profile/queries";

/**
 * HireMe - Floating circular CTA button
 *
 * Behavior:
 * - Floats at bottom-right (fixed position)
 * - Stops when reaching the footer top line
 * - Does not overlap footer content
 */
const HireMe = (): React.JSX.Element | null => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [offsetFromBottom, setOffsetFromBottom] = useState(0);
  const { data: profile } = useProfile(1);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || !containerRef.current) return;

    const handleScroll = (): void => {
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const bottomMargin = 16; // 1rem

      // Calculate where the button would be if fixed
      const buttonBottomIfFixed = viewportHeight - bottomMargin;

      // Check if footer top is above where the button bottom would be
      if (footerRect.top < buttonBottomIfFixed) {
        setIsAtFooter(true);
        // Calculate how much to offset the button up
        const offset = buttonBottomIfFixed - footerRect.top;
        setOffsetFromBottom(offset);
      } else {
        setIsAtFooter(false);
        setOffsetFromBottom(0);
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const dynamicStyle: React.CSSProperties = isAtFooter
    ? { bottom: `${16 + offsetFromBottom}px` }
    : {};

  if (!profile?.telegram) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="hire-me__container"
      data-testid="hire-me-circular"
      style={dynamicStyle}
    >
      <div className="hire-me__content">
        <CircularText
          className="hire-me__circular-text"
          fillSvgColor="dark:fill-white"
        />

        <Link
          href={profile.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="hire-me__link"
          data-testid="hire-me-link"
        >
          <span>Hire</span>
          <span>Me</span>
        </Link>
      </div>
    </div>
  );
};

export default HireMe;
