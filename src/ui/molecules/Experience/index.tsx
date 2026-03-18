"use client";

import "./styles.css";

import React, { useCallback, useMemo, useState, type MouseEvent } from "react";
import Image from "next/image";
import { TransitionerLi } from "@/atoms/hocs";
import ChevronDownIcon from "@/atoms/icons/ChevronDownIcon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import type { JobExperience } from "@/domains/job-experience";

type ExperienceProps = Pick<
  JobExperience,
  "id" | "position" | "company" | "companyLink" | "address" | "work"
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

const LOGO_PREVIEW_WIDTH = 120;
const LOGO_PREVIEW_HEIGHT = 120;
const LOGO_PREVIEW_OFFSET_X = 12;
const LOGO_PREVIEW_OFFSET_Y = 16;

type MousePosition = {
  x: number;
  y: number;
};

const calculateLogoPreviewPosition = ({
  x,
  y,
}: MousePosition): MousePosition => {
  if (typeof window === "undefined") {
    return { x, y };
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let nextX = x + LOGO_PREVIEW_OFFSET_X;
  let nextY = y - LOGO_PREVIEW_HEIGHT - LOGO_PREVIEW_OFFSET_Y;

  if (nextX + LOGO_PREVIEW_WIDTH > viewportWidth - 8) {
    nextX = x - LOGO_PREVIEW_WIDTH - LOGO_PREVIEW_OFFSET_X;
  }

  if (nextX < 8) {
    nextX = 8;
  }

  if (nextY < 8) {
    nextY = y + LOGO_PREVIEW_OFFSET_Y;
  }

  if (nextY + LOGO_PREVIEW_HEIGHT > viewportHeight - 8) {
    nextY = viewportHeight - LOGO_PREVIEW_HEIGHT - 8;
  }

  return { x: nextX, y: nextY };
};

const Experience = ({
  id,
  position,
  company,
  companyLink,
  year = "",
  address,
  contextBadges = [],
  technologies = [],
  work,
}: ExperienceProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logoHoverPosition, setLogoHoverPosition] =
    useState<MousePosition | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const hasWorkDetails = work && work.length > 0;
  const detailsId = `experience-details-${id}`;
  const companyLogo = getCompanyLogo(company);

  const logoPreviewPosition = useMemo(
    () =>
      logoHoverPosition
        ? calculateLogoPreviewPosition(logoHoverPosition)
        : null,
    [logoHoverPosition]
  );

  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleCompanyHover = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (!companyLogo) return;

      setLogoHoverPosition({ x: event.clientX, y: event.clientY });
    },
    [companyLogo]
  );

  const handleCompanyLeave = useCallback(() => {
    setLogoHoverPosition(null);
  }, []);

  return (
    <TransitionerLi data="">
      {/* Mobile: stacked, Desktop: inline */}
      <div className="experience__header">
        <a
          href={companyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="experience__company-link"
          onMouseEnter={handleCompanyHover}
          onMouseMove={handleCompanyHover}
          onMouseLeave={handleCompanyLeave}
        >
          <span className="experience__company-name">{company}</span>
        </a>
      </div>

      <div className="experience__role-row">
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

        <h3 className="experience__title">{position}</h3>
        {year ? <span className="experience__history-info">{year}</span> : null}
      </div>

      {companyLogo && logoPreviewPosition && (
        <div
          className={`experience__company-logo-preview ${
            shouldReduceMotion
              ? "experience__company-logo-preview--no-motion"
              : ""
          }`}
          style={{
            top: `${logoPreviewPosition.y}px`,
            left: `${logoPreviewPosition.x}px`,
          }}
          data-testid="experience-company-logo-preview"
          aria-hidden="true"
        >
          <Image
            src={companyLogo}
            alt={`${company} logo`}
            width={LOGO_PREVIEW_WIDTH}
            height={LOGO_PREVIEW_HEIGHT}
            className="experience__company-logo-preview-image"
          />
        </div>
      )}

      {contextBadges.length > 0 && (
        <div className="experience__meta-row" aria-label="Context badges">
          <div className="experience__context-badges">
            {contextBadges.map((badge) => (
              <span key={badge} className="experience__context-badge">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Location after badges */}
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
        </div>
      )}

      {technologies.length > 0 && (
        <div className="experience__technologies" aria-label="Technologies">
          {technologies.map((technology) => (
            <span key={technology} className="experience__technology-chip">
              {technology}
            </span>
          ))}
        </div>
      )}
    </TransitionerLi>
  );
};

export default Experience;
