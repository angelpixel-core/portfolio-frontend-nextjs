"use client";

import "./styles.css";

import React, { useState } from "react";
import Image from "next/image";
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

const COMPANY_LOGOS: Record<string, string> = {
  compass: "/images/customers/compass.png",
  southworks: "/images/customers/southworks.png",
  nubi: "/images/customers/nubi.png",
};

const normalizeCompanyKey = (companyName: string): string =>
  companyName.trim().toLowerCase();

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
  const companyLogo = COMPANY_LOGOS[normalizeCompanyKey(company)];

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <TransitionerLi data="">
      {/* Mobile: stacked, Desktop: inline */}
      <div className="experience__header">
        <h3 className="experience__title">{position}</h3>
        <a
          href={companyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="experience__company-link"
        >
          {companyLogo && (
            <Image
              src={companyLogo}
              alt={`${company} logo`}
              width={18}
              height={18}
              className="experience__company-logo"
            />
          )}
          <span>@{company}</span>
        </a>
      </div>

      {/* Date with inline toggle */}
      <div className="experience__history-row">
        {hasWorkDetails && (
          <button
            type="button"
            className={`experience__toggle-inline ${
              isExpanded ? "experience__toggle-inline--expanded" : ""
            } ${shouldReduceMotion ? "experience__toggle-inline--no-motion" : ""}`}
            aria-expanded={isExpanded}
            aria-controls={detailsId}
            aria-label={isExpanded ? "Hide details" : "Show details"}
            onClick={handleToggle}
            data-testid="experience-toggle"
          >
            <ChevronDownIcon className="experience__toggle-inline-chevron" />
          </button>
        )}
        <span className="experience__history-info">{time}</span>
      </div>

      {/* Location after date */}
      <span className="experience__location">{address}</span>

      {hasWorkDetails && isExpanded && (
        <div
          id={detailsId}
          data-testid="experience-details"
          className={`experience__details ${
            shouldReduceMotion ? "" : "experience__details--animated"
          }`}
        >
          <ul className="experience__responsibilities">
            {work.map((item, idx) => (
              <li key={idx} className="experience__responsibility-item">
                {item.description}
              </li>
            ))}
          </ul>

          {allTags.length > 0 && (
            <div className="experience__tags">
              {allTags.map((tag) => (
                <span key={tag} className="experience__tag">
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
