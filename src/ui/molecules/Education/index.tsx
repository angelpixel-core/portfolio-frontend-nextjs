"use client";

import "./styles.css";

import React from "react";
import Image from "next/image";
import { TransitionerLi } from "@/atoms/hocs";
import type { Academic } from "@/domains/academic";

/**
 * Education molecule - displays a single academic credential
 * Story 3.3: Academic Background
 * Story 3.4: Added verification link support
 * Refactored to match Experience pattern with expandable details
 */
type EducationProps = Academic;

const Education = ({
  degree,
  institution,
  start_date,
  end_date,
  verification_url,
}: EducationProps) => {
  const time =
    start_date === end_date ? start_date : `${start_date} - ${end_date}`;
  const hasAwsInstitution = /amazon web services/i.test(institution);

  return (
    <TransitionerLi data="">
      <h3 className="education__title">{degree}</h3>
      <p className="education__meta" data-testid="education-meta">
        <span className="education__location">{institution}</span>
        <span className="education__separator" aria-hidden="true">
          ·
        </span>
        <span className="education__history-info">{time}</span>
      </p>

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
    </TransitionerLi>
  );
};

export default Education;
