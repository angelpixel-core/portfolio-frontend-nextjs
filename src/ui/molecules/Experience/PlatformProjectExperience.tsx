"use client";

import React, { useState } from "react";
import { TransitionerLi } from "@/atoms/hocs";
import ChevronDownIcon from "@/atoms/icons/ChevronDownIcon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type { JobExperience } from "@/domains/job-experience";

type PlatformProjectExperienceProps = Pick<
  JobExperience,
  "company" | "companyLink" | "contextBadges" | "work" | "technologies"
>;

const PlatformProjectExperience = ({
  company,
  companyLink,
  contextBadges = [],
  work,
  technologies = [],
}: PlatformProjectExperienceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const hasWorkDetails = !!work?.length;

  return (
    <TransitionerLi data="">
      <article
        className="platform-project-card"
        data-testid="platform-project-card"
      >
        <a
          href={companyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="platform-project-card__company-link"
        >
          {company}
        </a>

        <div className="platform-project-card__meta-row">
          {hasWorkDetails && (
            <button
              type="button"
              className={`experience__toggle-inline experience__toggle-inline--meta ${
                isExpanded ? "experience__toggle-inline--expanded" : ""
              } ${shouldReduceMotion ? "experience__toggle-inline--no-motion" : ""}`}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Hide details" : "Show details"}
              onClick={() => setIsExpanded((prev) => !prev)}
              data-testid="platform-project-toggle"
            >
              <ChevronDownIcon className="experience__toggle-inline-chevron" />
            </button>
          )}

          {contextBadges.length > 0 && (
            <div
              className="platform-project-card__badges"
              aria-label="Project badges"
            >
              {contextBadges.map((badge) => (
                <span key={badge} className="platform-project-card__badge">
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {hasWorkDetails && isExpanded && (
          <div
            className={`experience__details ${
              shouldReduceMotion ? "" : "experience__details--animated"
            }`}
            data-testid="platform-project-details"
          >
            <ul className="experience__responsibilities">
              {work?.map((item, index) => (
                <li key={index} className="experience__responsibility-item">
                  {item.description}
                </li>
              ))}
            </ul>
          </div>
        )}

        {technologies.length > 0 && (
          <div
            className="platform-project-card__technologies"
            aria-label="Technologies"
          >
            {technologies.map((technology) => (
              <span key={technology} className="experience__technology-chip">
                {technology}
              </span>
            ))}
          </div>
        )}
      </article>
    </TransitionerLi>
  );
};

export default PlatformProjectExperience;
