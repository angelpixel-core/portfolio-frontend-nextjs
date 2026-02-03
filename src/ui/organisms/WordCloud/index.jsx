"use client";

import "./styles.css";

import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONCEPTS, getWeightClass } from "./data";
import { trackSkillInterest, matchesConcept } from "./telemetry";
import SkillDetail from "./SkillDetail";

/**
 * WordCloud Component
 *
 * Displays professional concepts as a word cloud.
 * Visual size is derived from concept weight.
 *
 * Features:
 * - Local search filtering (no backend events on typing)
 * - Telemetry triggered only on interaction with searched skills
 * - Tap/click opens skill detail overlay
 *   - Mobile: fullscreen overlay (60-70% viewport)
 *   - Desktop (≥720px): floating card anchored to word
 */
const WordCloud = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const wordRefs = useRef({});

  // Filter concepts locally based on search query
  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) {
      return CONCEPTS;
    }
    return CONCEPTS.filter((concept) => matchesConcept(concept, searchQuery));
  }, [searchQuery]);

  // Determine if we're in "search mode" (user has typed something)
  const isSearchMode = searchQuery.trim().length > 0;

  // Handle hover interaction - only track if found via search
  const handleHover = useCallback(
    (concept) => {
      if (isSearchMode) {
        trackSkillInterest({
          skillId: concept.id,
          source: "search",
          interaction: "hover",
          searchQuery: searchQuery.trim(),
        });
      }
    },
    [isSearchMode, searchQuery]
  );

  // Handle click/tap to open detail overlay
  const handleClick = useCallback(
    (concept, event) => {
      // Track interaction if in search mode
      if (isSearchMode) {
        trackSkillInterest({
          skillId: concept.id,
          source: "search",
          interaction: "tap",
          searchQuery: searchQuery.trim(),
        });
      }

      // Get the bounding rect of the clicked word for anchoring
      const rect = event.currentTarget.getBoundingClientRect();
      setAnchorRect(rect);
      setSelectedSkill(concept);
    },
    [isSearchMode, searchQuery]
  );

  // Close detail overlay
  const handleCloseDetail = useCallback(() => {
    setSelectedSkill(null);
    setAnchorRect(null);
  }, []);

  return (
    <div className="word-cloud" data-testid="word-cloud">
      {/* Search Input */}
      <div className="word-cloud__search">
        <input
          type="text"
          className="word-cloud__search-input"
          placeholder="Keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search skills"
          data-testid="word-cloud-search"
        />
        {searchQuery && (
          <button
            className="word-cloud__search-clear"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            type="button"
          >
            ×
          </button>
        )}
      </div>

      {/* Word Cloud Container */}
      <div className="word-cloud__container">
        <AnimatePresence mode="popLayout">
          {filteredConcepts.length > 0 ? (
            filteredConcepts.map((concept, index) => (
              <motion.button
                key={concept.id}
                ref={(el) => (wordRefs.current[concept.id] = el)}
                className={`word-cloud__word ${getWeightClass(concept.weight)} ${
                  isSearchMode ? "word-cloud__word--searched" : ""
                } ${selectedSkill?.id === concept.id ? "word-cloud__word--selected" : ""}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => handleHover(concept)}
                onClick={(e) => handleClick(concept, e)}
                type="button"
                aria-expanded={selectedSkill?.id === concept.id}
                aria-haspopup="dialog"
              >
                <span className="word-cloud__label">{concept.label}</span>
                <span className="word-cloud__keywords">
                  {concept.relatedKeywords.slice(0, 3).join(" · ")}
                </span>
              </motion.button>
            ))
          ) : (
            <motion.div
              className="word-cloud__empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span className="word-cloud__empty-text">
                No matching skills found
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
