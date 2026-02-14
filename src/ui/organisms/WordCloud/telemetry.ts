import { logger } from "@/lib/logger";
import type { Concept } from "./data";

/**
 * WordCloud Telemetry
 *
 * Prepared telemetry functions for tracking skill interest.
 * Backend integration NOT implemented - functions are ready for future use.
 *
 * Events are only triggered when:
 * - User interacts (hover/tap) with a skill
 * - That skill was found via search (not browsing)
 */

interface TrackSkillInterestParams {
  skillId: string;
  source: string;
  interaction: string;
  searchQuery?: string;
}

/**
 * Track user interest in a skill
 *
 * @param {Object} params - Telemetry parameters
 * @param {string} params.skillId - The concept/skill ID (e.g., "systems-design")
 * @param {string} params.source - How the skill was found: "search" | "browse"
 * @param {string} params.interaction - Type of interaction: "hover" | "tap" | "click"
 * @param {string} [params.searchQuery] - The search query if source is "search"
 *
 * @example
 * trackSkillInterest({
 *   skillId: "backend-engineering",
 *   source: "search",
 *   interaction: "hover",
 *   searchQuery: "node"
 * });
 */
export const trackSkillInterest = ({
  skillId,
  source,
  interaction,
  searchQuery,
}: TrackSkillInterestParams): void => {
  // Only track if skill was found via search
  if (source !== "search") {
    return;
  }

  const event = {
    type: "skill_interest",
    timestamp: new Date().toISOString(),
    payload: {
      skillId,
      source,
      interaction,
      searchQuery: searchQuery || null,
    },
  };

  // TODO: Send to backend when ready
  // await fetch('/api/telemetry', { method: 'POST', body: JSON.stringify(event) });

  // Development logging (controlled by logger level)
  logger.debug("Telemetry", "Skill interest event", event);
};

/**
 * Check if a concept matches a search query
 *
 * @param {Object} concept - The concept object
 * @param {string} query - Search query (lowercase)
 * @returns {boolean} - Whether the concept matches
 */
export const matchesConcept = (concept: Concept, query: string): boolean => {
  if (!query) return true;

  const lowerQuery = query.toLowerCase();

  // Match label
  if (concept.label.toLowerCase().includes(lowerQuery)) {
    return true;
  }

  // Match description
  if (concept.description.toLowerCase().includes(lowerQuery)) {
    return true;
  }

  // Match related keywords
  if (
    concept.relatedKeywords.some((kw) => kw.toLowerCase().includes(lowerQuery))
  ) {
    return true;
  }

  return false;
};
