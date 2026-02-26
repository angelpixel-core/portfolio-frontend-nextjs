"use client";

import "./styles.css";

import React, { useState } from "react";
import { TransitionerLi } from "@/atoms/hocs";
import ChevronDownIcon from "@/atoms/icons/ChevronDownIcon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
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
      <h3 className="education__title">{degree}</h3>

      {/* Location (institution) */}
      <span className="education__location">{institution}</span>

      {/* Date with inline toggle */}
      <div className="education__history-row">
        {hasDetails && (
          <button
            type="button"
            className={`education__toggle-inline ${
              isExpanded ? "education__toggle-inline--expanded" : ""
            } ${shouldReduceMotion ? "education__toggle-inline--no-motion" : ""}`}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={isExpanded ? "Hide details" : "Show details"}
            onClick={handleToggle}
            data-testid="education-toggle"
          >
            <ChevronDownIcon className="education__toggle-inline-chevron" />
          </button>
        )}
        <span className="education__history-info">{time}</span>
      </div>

      {/* Expandable details */}
      {hasDetails && isExpanded && (
        <div
          id={detailsId}
          data-testid="education-details"
          className={`education__details ${
            shouldReduceMotion ? "" : "education__details--animated"
          }`}
        >
          {verification_url && (
            <a
              href={verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="education__verification-link"
              aria-label={`Verify ${degree} credential`}
              data-testid="education-verification-link"
            >
              Verify credential
            </a>
          )}
          {resume && <p className="education__description">{resume}</p>}
        </div>
      )}
    </TransitionerLi>
  );
};

export default Education;
