"use client";

import "./styles.css";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { CircularText } from "@/atoms/texts";

/**
 * HireMe - Floating circular CTA button
 *
 * Behavior:
 * - Floats at bottom-right (fixed position)
 * - Stops when reaching the footer top line
 * - Does not overlap footer content
 */
const HireMe = () => {
  const profile = { telegram: "https://t.me/angelszymczak" };
  const containerRef = useRef(null);
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [offsetFromBottom, setOffsetFromBottom] = useState(0);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || !containerRef.current) return;

    const handleScroll = () => {
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const buttonHeight = containerRef.current?.offsetHeight || 96;
      const bottomMargin = 16; // 1rem

      // Calculate where the button would be if fixed
      const buttonBottomIfFixed = viewportHeight - bottomMargin;
      const _buttonTopIfFixed = buttonBottomIfFixed - buttonHeight;

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

  const dynamicStyle = isAtFooter
    ? { bottom: `${16 + offsetFromBottom}px` }
    : {};

  return (
    <div
      ref={containerRef}
      className="hire-me_container"
      data-testid="hire-me-circular"
      style={dynamicStyle}
    >
      <div className="hire-me_content">
        <CircularText
          className="hire-me_circular-text"
          fillSvgColor="dark:fill-white"
        />

        <Link
          href={profile.telegram}
          target="_blank"
          rel="noopener noreferrer"
          className="hire-me_link"
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
