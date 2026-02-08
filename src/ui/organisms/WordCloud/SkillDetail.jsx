"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as Icons from "./icons";

/**
 * Get icon component by name
 */
const getIconComponent = (iconName) => {
  return Icons[iconName] || null;
};

/**
 * SkillDetail Component
 *
 * Overlay showing skill description, technologies with icons, and companies.
 *
 * Behavior:
 * - Mobile (<720px): Fullscreen overlay (60-70% viewport height)
 * - Desktop (≥720px): Floating card anchored to clicked word
 *
 * Feels like an extension of the cloud, not a page transition.
 */
const SkillDetail = ({ skill, anchorRect, onClose }) => {
  const overlayRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Close on click outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (overlayRef.current && !overlayRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Delay to prevent immediate close from the click that opened it
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  // Calculate floating card position (desktop only, ≥720px)
  const getFloatingStyle = () => {
    if (!anchorRect || typeof window === "undefined") return {};

    // On mobile (<720px), let CSS handle full-width bottom sheet
    if (window.innerWidth < 720) return {};

    const cardWidth = 320;
    const cardHeight = 400; // Increased for new sections
    const padding = 16;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Position below the word by default
    let top = anchorRect.bottom + padding;
    let left = anchorRect.left + anchorRect.width / 2 - cardWidth / 2;

    // Adjust if card would go off-screen horizontally
    if (left < padding) {
      left = padding;
    } else if (left + cardWidth > viewportWidth - padding) {
      left = viewportWidth - cardWidth - padding;
    }

    // If card would go off-screen vertically, position above the word
    if (top + cardHeight > viewportHeight - padding) {
      top = anchorRect.top - cardHeight - padding;
    }

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
    };
  };

  if (!skill) return null;

  return (
    <>
      {/* Mobile backdrop */}
      <motion.div
        className="skill-detail__backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Detail card */}
      <motion.div
        ref={overlayRef}
        className="skill-detail"
        style={getFloatingStyle()}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{
          duration: 0.25,
          ease: [0.4, 0, 0.2, 1],
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="skill-detail-title"
      >
        {/* Header */}
        <div className="skill-detail__header">
          <h3 id="skill-detail-title" className="skill-detail__title">
            {skill.label}
          </h3>
          <button
            className="skill-detail__close"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
        </div>

        {/* Description */}
        <p className="skill-detail__description">{skill.description}</p>

        {/* Technologies with Icons */}
        {skill.technologies && skill.technologies.length > 0 && (
          <div className="skill-detail__technologies">
            <span className="skill-detail__section-label">Technologies:</span>
            <div className="skill-detail__tech-list">
              {skill.technologies.map((tech) => {
                const IconComponent = getIconComponent(tech.icon);
                return (
                  <span key={tech.name} className="skill-detail__tech-item">
                    {IconComponent && (
                      <svg
                        className="skill-detail__tech-icon"
                        viewBox="0 0 128 128"
                        aria-hidden="true"
                      >
                        <IconComponent />
                      </svg>
                    )}
                    <span className="skill-detail__tech-name">{tech.name}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Companies */}
        {skill.companies && skill.companies.length > 0 && (
          <div className="skill-detail__companies">
            <span className="skill-detail__section-label">Experience at:</span>
            <div className="skill-detail__companies-list">
              {skill.companies.map((company) => (
                <span key={company} className="skill-detail__company">
                  {company}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Keywords */}
        <div className="skill-detail__keywords">
          <span className="skill-detail__keywords-label">Related:</span>
          <div className="skill-detail__keywords-list">
            {skill.relatedKeywords.map((keyword) => (
              <span key={keyword} className="skill-detail__keyword">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SkillDetail;
