"use client";

import "./styles.css";

import React, { useState } from "react";
import { TransitionerLi } from "@/atoms/hocs";
import { ChevronDownIcon } from "@/icons";
import { useReducedMotion } from "@/hooks";
import type { Academic } from "@/domains/academic";

/**
 * Education molecule - displays a single academic credential
 * Story 3.3: Academic Background
 * Story 3.4: Added verification link support
 * Refactored to match Experience pattern with expandable details
 */
type EducationProps = Academic;

const Education = ({
  id,
  degree,
  institution,
  start_date,
  end_date,
  resume,
  verification_url,
}: EducationProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const time = `${start_date} - ${end_date}`;
  const hasDetails = resume || verification_url;
  const detailsId = `education-details-${id}`;

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <TransitionerLi data="">
      {/* Title */}
      <h3 className="education_title">{degree}</h3>

      {/* Location (institution) */}
      <span className="education_location">{institution}</span>

      {/* Date with inline toggle */}
      <div className="education_history-row">
        {hasDetails && (
          <button
            type="button"
            className={`education_toggle-inline ${
              isExpanded ? "education_toggle-inline--expanded" : ""
            } ${shouldReduceMotion ? "education_toggle-inline--no-motion" : ""}`}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={isExpanded ? "Hide details" : "Show details"}
            onClick={handleToggle}
            data-testid="education-toggle"
          >
            <ChevronDownIcon className="education_toggle-inline-chevron" />
          </button>
        )}
        <span className="education_history-info">{time}</span>
      </div>

      {/* Expandable details */}
      {hasDetails && isExpanded && (
        <div
          id={detailsId}
          data-testid="education-details"
          className={`education_details ${
            shouldReduceMotion ? "" : "education_details--animated"
          }`}
        >
          {verification_url && (
            <a
              href={verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="education_verification-link"
              aria-label={`Verify ${degree} credential`}
              data-testid="education-verification-link"
            >
              Verify credential
            </a>
          )}
          {resume && <p className="education_description">{resume}</p>}
        </div>
      )}
    </TransitionerLi>
  );
};

export default Education;
