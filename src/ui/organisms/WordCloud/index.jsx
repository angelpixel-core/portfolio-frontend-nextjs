"use client";

import "./styles.css";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import TagCloud from "TagCloud";
import { CONCEPTS } from "./data";
import { trackSkillInterest } from "./telemetry";
import SkillDetail from "./SkillDetail";

/**
 * WordCloud Component - 3D Spherical Tag Cloud
 *
 * Displays professional concepts as an orbiting 3D cloud.
 * Visual size is derived from concept weight.
 *
 * Features:
 * - 3D spherical rotation effect (TagCloud.js)
 * - Click/tap opens skill detail overlay
 * - Weighted text sizes based on concept importance
 */
const WordCloud = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const containerRef = useRef(null);
  const tagCloudInstanceRef = useRef(null);

  // Safe cleanup helper
  const safeDestroy = useCallback(() => {
    if (tagCloudInstanceRef.current) {
      try {
        tagCloudInstanceRef.current.destroy();
      } catch {
        // TagCloud may have already been cleaned up by React Strict Mode
      }
      tagCloudInstanceRef.current = null;
    }
  }, []);

  // Initialize TagCloud on mount
  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing instance
    safeDestroy();

    // Clear container
    containerRef.current.innerHTML = "";

    // Create text array from concepts
    const texts = CONCEPTS.map((concept) => concept.label);

    // TagCloud options for 3D spherical rotation
    const options = {
      radius: getRadius(),
      maxSpeed: "normal",
      initSpeed: "fast",
      direction: 135,
      keep: true,
    };

    // Initialize TagCloud
    tagCloudInstanceRef.current = TagCloud(
      containerRef.current,
      texts,
      options
    );

    // Handle resize
    const handleResize = () => {
      if (tagCloudInstanceRef.current && containerRef.current) {
        safeDestroy();
        containerRef.current.innerHTML = "";
        tagCloudInstanceRef.current = TagCloud(containerRef.current, texts, {
          ...options,
          radius: getRadius(),
        });
        applyWeightedStyles();
        attachClickHandlers();
      }
    };

    // Apply weighted styles after initialization
    setTimeout(() => {
      applyWeightedStyles();
      attachClickHandlers();
    }, 100);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      safeDestroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeDestroy]);

  // Get radius based on viewport
  const getRadius = () => {
    if (typeof window === "undefined") return 200;
    const width = window.innerWidth;
    if (width < 480) return 120;
    if (width < 640) return 150;
    if (width < 768) return 180;
    if (width < 1024) return 220;
    return 250;
  };

  // Apply weighted font sizes to tags
  const applyWeightedStyles = () => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".tagcloud--item");
    items.forEach((item) => {
      const text = item.textContent;
      const concept = CONCEPTS.find((c) => c.label === text);
      if (concept) {
        // Apply weight class
        item.classList.add(`tagcloud--weight-${concept.weight}`);
        item.setAttribute("data-concept-id", concept.id);
      }
    });
  };

  // Attach click handlers to tags
  const attachClickHandlers = useCallback(() => {
    if (!containerRef.current) return;

    const items = containerRef.current.querySelectorAll(".tagcloud--item");
    items.forEach((item) => {
      item.addEventListener("click", (e) => {
        const text = item.textContent;
        const concept = CONCEPTS.find((c) => c.label === text);
        if (concept) {
          handleClick(concept, e);
        }
      });
    });
  }, []);

  // Handle click/tap to open detail overlay
  const handleClick = (concept, event) => {
    // Track interaction
    trackSkillInterest({
      skillId: concept.id,
      source: "cloud",
      interaction: "tap",
    });

    // Get the bounding rect of the clicked word for anchoring
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchorRect(rect);
    setSelectedSkill(concept);
  };

  // Close detail overlay
  const handleCloseDetail = useCallback(() => {
    setSelectedSkill(null);
    setAnchorRect(null);
  }, []);

  return (
    <div className="word-cloud" data-testid="word-cloud">
      {/* 3D Tag Cloud Container */}
      <div
        ref={containerRef}
        className="word-cloud__sphere tagcloud"
        data-testid="word-cloud-sphere"
      />

      {/* Skill Detail Overlay */}
      <AnimatePresence>
        {selectedSkill && (
          <SkillDetail
            skill={selectedSkill}
            anchorRect={anchorRect}
            onClose={handleCloseDetail}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WordCloud;
