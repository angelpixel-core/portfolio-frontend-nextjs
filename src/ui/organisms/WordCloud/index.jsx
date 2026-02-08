"use client";

import "./styles.css";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { AnimatePresence } from "framer-motion";
import { CONCEPTS } from "./data";
import { trackSkillInterest } from "./telemetry";

const SkillDetail = lazy(() => import("./SkillDetail"));

/**
 * WordCloud Component - 3D Spherical Tag Cloud with Search
 *
 * Displays professional concepts as an orbiting 3D cloud.
 * Visual size is derived from concept weight.
 *
 * Features:
 * - 3D spherical rotation effect (TagCloud.js)
 * - Search to find and highlight concepts
 * - Click/tap opens skill detail overlay
 * - Weighted text sizes based on concept importance
 */
const WordCloud = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [matchedConcept, setMatchedConcept] = useState(null);
  const containerRef = useRef(null);
  const tagCloudInstanceRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Find concept matching search query
  const findMatchingConcept = useCallback((query) => {
    if (!query || query.length < 2) return null;

    const lowerQuery = query.toLowerCase();

    // Search in label, keywords, and technology names
    return CONCEPTS.find((concept) => {
      // Match label
      if (concept.label.toLowerCase().includes(lowerQuery)) return true;

      // Match related keywords
      if (
        concept.relatedKeywords?.some((kw) =>
          kw.toLowerCase().includes(lowerQuery)
        )
      )
        return true;

      // Match technology names
      if (
        concept.technologies?.some((tech) =>
          tech.name.toLowerCase().includes(lowerQuery)
        )
      )
        return true;

      return false;
    });
  }, []);

  // Highlight matched concept in the cloud
  const highlightConcept = useCallback((concept) => {
    if (!containerRef.current) return;

    // Remove previous highlights
    const items = containerRef.current.querySelectorAll(".tagcloud--item");
    items.forEach((item) => {
      item.classList.remove("tagcloud--highlighted");
    });

    if (!concept) return;

    // Find and highlight the matching item
    items.forEach((item) => {
      if (item.textContent === concept.label) {
        item.classList.add("tagcloud--highlighted");
      }
    });
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback(
    (e) => {
      const query = e.target.value;
      setSearchQuery(query);

      // Debounce search
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        const matched = findMatchingConcept(query);
        setMatchedConcept(matched);
        highlightConcept(matched);

        // Track search if matched
        if (matched) {
          trackSkillInterest({
            skillId: matched.id,
            source: "search",
            interaction: "highlight",
          });
        }
      }, 300);
    },
    [findMatchingConcept, highlightConcept]
  );

  // Handle clicking the search result hint
  const handleSearchResultClick = useCallback(() => {
    if (matchedConcept) {
      // Find the element and simulate click
      const items = containerRef.current?.querySelectorAll(".tagcloud--item");
      items?.forEach((item) => {
        if (item.textContent === matchedConcept.label) {
          const rect = item.getBoundingClientRect();
          setAnchorRect(rect);
          setSelectedSkill(matchedConcept);

          trackSkillInterest({
            skillId: matchedConcept.id,
            source: "search",
            interaction: "tap",
          });
        }
      });
    }
  }, [matchedConcept]);

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

  // Get radius based on viewport
  const getRadius = useCallback(() => {
    if (typeof window === "undefined") return 200;
    const width = window.innerWidth;
    if (width < 480) return 120;
    if (width < 640) return 150;
    if (width < 768) return 180;
    if (width < 1024) return 220;
    return 250;
  }, []);

  // Initialize TagCloud on mount (lazy loaded)
  useEffect(() => {
    if (!containerRef.current) return;

    let TagCloud = null;
    let handleResize = null;
    let isMounted = true;

    // Dynamic import for better code splitting
    const initTagCloud = async () => {
      const TagCloudModule = await import("TagCloud");
      TagCloud = TagCloudModule.default;

      if (!containerRef.current || !isMounted) return;

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

      // Apply weighted styles after initialization
      const applyWeightedStyles = () => {
        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll(".tagcloud--item");
        items.forEach((item) => {
          const text = item.textContent;
          const concept = CONCEPTS.find((c) => c.label === text);
          if (concept) {
            item.classList.add(`tagcloud--weight-${concept.weight}`);
            item.setAttribute("data-concept-id", concept.id);
          }
        });
      };

      // Attach click handlers to tags
      const attachClickHandlers = () => {
        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll(".tagcloud--item");
        items.forEach((item) => {
          item.addEventListener("click", (e) => {
            const text = item.textContent;
            const concept = CONCEPTS.find((c) => c.label === text);
            if (concept) {
              trackSkillInterest({
                skillId: concept.id,
                source: "cloud",
                interaction: "tap",
              });

              const rect = e.currentTarget.getBoundingClientRect();
              setAnchorRect(rect);
              setSelectedSkill(concept);
            }
          });
        });
      };

      // Handle resize
      handleResize = () => {
        if (tagCloudInstanceRef.current && containerRef.current && TagCloud) {
          safeDestroy();
          containerRef.current.innerHTML = "";
          tagCloudInstanceRef.current = TagCloud(containerRef.current, texts, {
            ...options,
            radius: getRadius(),
          });
          setTimeout(() => {
            applyWeightedStyles();
            attachClickHandlers();
            // Re-apply highlight if there's a matched concept
            if (matchedConcept) {
              highlightConcept(matchedConcept);
            }
          }, 100);
        }
      };

      // Apply styles after initialization
      setTimeout(() => {
        applyWeightedStyles();
        attachClickHandlers();
      }, 100);

      window.addEventListener("resize", handleResize);
    };

    initTagCloud();

    return () => {
      isMounted = false;
      if (handleResize) {
        window.removeEventListener("resize", handleResize);
      }
      safeDestroy();
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeDestroy, getRadius]);

  // Close detail overlay
  const handleCloseDetail = useCallback(() => {
    setSelectedSkill(null);
    setAnchorRect(null);
  }, []);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setMatchedConcept(null);
    highlightConcept(null);
  }, [highlightConcept]);

  return (
    <div className="word-cloud" data-testid="word-cloud">
      {/* Search Input */}
      <div className="word-cloud__search">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search skills... (e.g. Ruby, React, AWS)"
          className="word-cloud__search-input"
          data-testid="word-cloud-search"
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="word-cloud__search-clear"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Search Result Hint */}
      {matchedConcept && (
        <button
          onClick={handleSearchResultClick}
          className="word-cloud__search-hint"
        >
          <span className="word-cloud__search-hint-icon">→</span>
          <span className="word-cloud__search-hint-text">
            Found in <strong>{matchedConcept.label}</strong>
          </span>
          <span className="word-cloud__search-hint-action">Click to view</span>
        </button>
      )}

      {/* 3D Tag Cloud Container */}
      <div
        ref={containerRef}
        className="word-cloud__sphere tagcloud"
        data-testid="word-cloud-sphere"
      />

      {/* Skill Detail Overlay */}
      <AnimatePresence>
        {selectedSkill && (
          <Suspense fallback={null}>
            <SkillDetail
              skill={selectedSkill}
              anchorRect={anchorRect}
              onClose={handleCloseDetail}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WordCloud;
