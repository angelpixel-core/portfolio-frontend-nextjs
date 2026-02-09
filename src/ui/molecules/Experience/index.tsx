"use client";

import "./styles.css";

import React, { useState } from "react";
import { TransitionerLi } from "@/atoms/hocs";
import ChevronDownIcon from "@/atoms/icons/ChevronDownIcon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type {
  JobExperience,
  JobExperienceTask,
} from "@/domains/job-experience";

type ExperienceProps = Pick<
  JobExperience,
  "id" | "position" | "company" | "companyLink" | "time" | "address" | "work"
>;

/**
 * Extracts unique tags from all work items
 */
function extractUniqueTags(work?: JobExperienceTask[]): string[] {
  if (!work) return [];

  const allTags = work.flatMap((item) => item.tags || []);
  return [...new Set(allTags)];
}

const Experience = ({
  id,
  position,
  company,
  companyLink,
  time,
  address,
  work,
}: ExperienceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const hasWorkDetails = work && work.length > 0;
  const allTags = extractUniqueTags(work);
  const detailsId = `experience-details-${id}`;

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <TransitionerLi data="">
      {/* Mobile: stacked, Desktop: inline */}
      <div className="experience_header">
        <h3 className="experience_title">{position}</h3>
        <a
          href={companyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="experience_company-link"
        >
          @{company}
        </a>
      </div>

      {/* Location after company */}
      <span className="experience_location">{address}</span>

      {/* Date with inline toggle */}
      <div className="experience_history-row">
        {hasWorkDetails && (
          <button
            type="button"
            className={`experience_toggle-inline ${
              isExpanded ? "experience_toggle-inline--expanded" : ""
            } ${shouldReduceMotion ? "experience_toggle-inline--no-motion" : ""}`}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={isExpanded ? "Hide details" : "Show details"}
            onClick={handleToggle}
            data-testid="experience-toggle"
          >
            <ChevronDownIcon className="experience_toggle-inline-chevron" />
          </button>
        )}
        <span className="experience_history-info">{time}</span>
      </div>

      {hasWorkDetails && isExpanded && (
        <div
          id={detailsId}
          data-testid="experience-details"
          className={`experience_details ${
            shouldReduceMotion ? "" : "experience_details--animated"
          }`}
        >
          <ul className="experience_responsibilities">
            {work.map((item, idx) => (
              <li key={idx} className="experience_responsibility-item">
                {item.description}
              </li>
            ))}
          </ul>

          {allTags.length > 0 && (
            <div className="experience_tags">
              {allTags.map((tag) => (
                <span key={tag} className="experience_tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </TransitionerLi>
  );
};

export default Experience;
