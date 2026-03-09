"use client";

import "./styles.css";

import React, { useState } from "react";
import Image from "next/image";
import { TransitionerLi } from "@/atoms/hocs";
import ChevronDownIcon from "@/atoms/icons/ChevronDownIcon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type { JobExperience } from "@/domains/job-experience";

type ExperienceProps = Pick<
  JobExperience,
  "id" | "position" | "company" | "companyLink" | "time" | "address" | "work"
> & {
  year?: JobExperience["year"];
  contextBadges?: JobExperience["contextBadges"];
  technologies?: JobExperience["technologies"];
};

const COMPANY_LOGOS: Record<string, string> = {
  compass: "/images/customers/compass.png",
  southworks: "/images/customers/southworks.png",
  nubi: "/images/customers/nubi.png",
};

const normalizeCompanyKey = (companyName: string): string =>
  companyName.trim().toLowerCase();

const getCompanyLogo = (companyName: string): string | null => {
  const companyKey = normalizeCompanyKey(companyName);
  if (!companyKey) return null;

  return COMPANY_LOGOS[companyKey] ?? null;
};

const Experience = ({
  id,
  position,
  company,
  companyLink,
  time,
  year = "",
  address,
  contextBadges = [],
  technologies = [],
  work,
}: ExperienceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const hasWorkDetails = work && work.length > 0;
  const detailsId = `experience-details-${id}`;
  const companyLogo = getCompanyLogo(company);

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <TransitionerLi data="">
      {/* Mobile: stacked, Desktop: inline */}
      <div className="experience__header">
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
          <span className="experience__company-name">{company}</span>
        </a>
        <h3 className="experience__title">{position}</h3>
      </div>

      <div className="experience__meta-row">
        <span className="experience__year">{year}</span>
        {contextBadges.length > 0 && (
          <div
            className="experience__context-badges"
            aria-label="Context badges"
          >
            {contextBadges.map((badge) => (
              <span key={badge} className="experience__context-badge">
                {badge}
              </span>
            ))}
          </div>
        )}
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

      {technologies.length > 0 && (
        <div className="experience__technologies" aria-label="Technologies">
          {technologies.map((technology) => (
            <span key={technology} className="experience__technology-chip">
              {technology}
            </span>
          ))}
        </div>
      )}

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
        </div>
      )}
    </TransitionerLi>
  );
};

export default Experience;
