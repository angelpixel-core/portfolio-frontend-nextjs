"use client";

import "./styles.css";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONCEPTS, getWeightClass } from "./data";
import { trackSkillInterest, matchesConcept } from "./telemetry";

/**
 * WordCloud Component
 *
 * Displays professional concepts as a word cloud.
 * Visual size is derived from concept weight.
 *
 * Features:
 * - Local search filtering (no backend events on typing)
 * - Telemetry triggered only on interaction with searched skills
 */
const WordCloud = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter concepts locally based on search query
  const filteredConcepts = useMemo(() => {
    if (!searchQuery.trim()) {
      return CONCEPTS;
    }
    return CONCEPTS.filter((concept) => matchesConcept(concept, searchQuery));
  }, [searchQuery]);

  // Determine if we're in "search mode" (user has typed something)
  const isSearchMode = searchQuery.trim().length > 0;

  // Handle interaction (hover/tap) - only track if found via search
  const handleInteraction = useCallback(
    (concept, interaction) => {
      if (isSearchMode) {
        trackSkillInterest({
          skillId: concept.id,
          source: "search",
          interaction,
          searchQuery: searchQuery.trim(),
        });
      }
    },
    [isSearchMode, searchQuery]
  );

  return (
    <div className="word-cloud" data-testid="word-cloud">
      {/* Search Input */}
      <div className="word-cloud__search">
        <input
          type="text"
          className="word-cloud__search-input"
          placeholder="Search skills..."
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
              <motion.div
                key={concept.id}
                className={`word-cloud__word ${getWeightClass(concept.weight)} ${
                  isSearchMode ? "word-cloud__word--searched" : ""
                }`}
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
                onHoverStart={() => handleInteraction(concept, "hover")}
                onTap={() => handleInteraction(concept, "tap")}
              >
                <span className="word-cloud__label">{concept.label}</span>
                <span className="word-cloud__keywords">
                  {concept.relatedKeywords.slice(0, 3).join(" · ")}
                </span>
              </motion.div>
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

      {/* Search hint */}
      {!searchQuery && (
        <p className="word-cloud__hint">
          Try searching: React, AWS, Architecture...
        </p>
      )}
    </div>
  );
};

export default WordCloud;
