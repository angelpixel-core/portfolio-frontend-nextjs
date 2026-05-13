"use client";

import React from "react";

import "./styles.css";

import { useState, useEffect, useRef } from "react";
import CircularText from "@/atoms/texts/CircularText";
import { trackEvent } from "@/observability/analytics";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import useHireFlowPanel from "@/state/slices/hireFlowPanel/hooks";
import type { HireFlowIntent } from "@/state/slices/hireFlowPanel";
import { saveHireFlowIntent } from "@/services/hireFlow/intent";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [offsetFromBottom, setOffsetFromBottom] = useState(0);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const { isAuthenticated, openAuthPanel } = useAuthPanel();
  const { openHireFlow, setHireFlowIntent } = useHireFlowPanel();

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer || !containerRef.current) return;

    const handleScroll = (): void => {
      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const bottomMargin = 320; // 20rem

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

  const handleMagneticMove = (
    event: React.MouseEvent<HTMLDivElement>
  ): void => {
    if (!contentRef.current) return;

    const rect = contentRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = event.clientX - centerX;
    const deltaY = event.clientY - centerY;

    const maxOffset = 480;
    const x = (deltaX / (rect.width / 2)) * maxOffset;
    const y = (deltaY / (rect.height / 2)) * maxOffset;

    setMagneticOffset({
      x: Math.max(-maxOffset, Math.min(maxOffset, x)),
      y: Math.max(-maxOffset, Math.min(maxOffset, y)),
    });
  };

  const resetMagneticOffset = (): void => {
    setMagneticOffset({ x: 0, y: 0 });
  };

  const handleClick = () => {
    const intent: HireFlowIntent = {
      source: "hire_me_floating",
      createdAt: Date.now(),
    };

    trackEvent("cta_contact_click", {
      label: "hire me",
      href: "hire_flow",
    });

    if (isAuthenticated) {
      openHireFlow();
      return;
    }

    setHireFlowIntent(intent);
    saveHireFlowIntent(intent);
    openAuthPanel();
  };

  return (
    <div
      ref={containerRef}
      className="hire-me__container"
      data-testid="hire-me-circular"
      style={dynamicStyle}
    >
      <div
        ref={contentRef}
        className="hire-me__content"
        onMouseMove={handleMagneticMove}
        onMouseLeave={resetMagneticOffset}
        style={
          {
            "--hire-me-magnetic-x": `${magneticOffset.x}px`,
            "--hire-me-magnetic-y": `${magneticOffset.y}px`,
          } as React.CSSProperties
        }
      >
        <CircularText
          className="hire-me__circular-text"
          fillSvgColor="dark:fill-white"
        />

        <button
          type="button"
          className="hire-me__link"
          data-testid="hire-me-link"
          onClick={handleClick}
        >
          <span>Hire</span>
          <span>Me</span>
        </button>
      </div>
    </div>
  );
};

export default HireMe;
