"use client";

import "./styles.css";

import React, { useState } from "react";
import Image from "next/image";
import { TransitionerLi } from "@/atoms/hocs";
import ChevronDownIcon from "@/atoms/icons/ChevronDownIcon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type { Academic } from "@/domains/academic";
import { trackEvent } from "@/observability/analytics";

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
  const time = end_date || start_date;
  const hasAwsInstitution = /amazon web services/i.test(institution);
  const hasExpandableContent = Boolean(resume || verification_url);
  const detailsId = `education-details-${id}`;

  const handleToggle = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (next) {
        trackEvent("details_expand", {
          section: "education",
          label: institution,
        });
      }
      return next;
    });
  };

  return (
    <TransitionerLi data="">
      <h3 className="education__title">{degree}</h3>
      <div className="education__history-row">
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
        <p className="education__meta" data-testid="education-meta">
          <span className="education__location">{institution}</span>
          <span className="education__separator" aria-hidden="true">
            ·
          </span>
          <span className="education__history-info">{time}</span>
        </p>
      </div>

      {isExpanded && (
        <div
          id={detailsId}
          data-testid="education-details"
          className={`education__details ${
            shouldReduceMotion ? "" : "education__details--animated"
          }`}
        >
          {resume ? <p className="education__details-text">{resume}</p> : null}
          {verification_url && (
            <a
              href={verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="education__verification-link"
              aria-label={`Verify ${degree} credential`}
              data-testid="education-verification-link"
            >
              {hasAwsInstitution ? (
                <span className="education__verification-content">
                  <Image
                    src="/images/certifications/aws-ccp-badge.png"
                    alt="AWS Certified Cloud Practitioner badge"
                    width={120}
                    height={120}
                    sizes="120px"
                    className="education__verification-icon"
                    data-testid="education-verification-aws-icon"
                  />
                  <span>Verify Credentials</span>
                </span>
              ) : (
                "Verify credential"
              )}
            </a>
          )}
          {!hasExpandableContent ? (
            <p className="education__details-text">
              Additional details available upon request.
            </p>
          ) : null}
        </div>
      )}
    </TransitionerLi>
  );
};

export default Education;
