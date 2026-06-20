"use client";

import React, { useEffect, useState } from "react";

import "@/buttons/ArrowButton/styles.css";
import "./styles.css";

import ArrowIcon from "@/atoms/icons/ArrowIcon";
import Skeleton from "@/buttons/ArrowButton/skeleton";
import { trackEvent } from "@/observability/analytics";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import useResumeRequestPanel from "@/state/slices/resumeRequestPanel/hooks";
import type { ResumeRequestIntent } from "@/state/slices/resumeRequestPanel";
import {
  fetchResumeRequestStatus,
  type ResumeRequestStatus,
} from "@/application/resumeRequest/client";
import { saveResumeRequestIntent } from "@/application/intents/resumeRequest";

type ResumeCtaStatusConfig = {
  label: string;
  ariaLabel: string;
  className: string;
};

const RESUME_CTA_STATUS_MAP: Record<
  ResumeRequestStatus,
  ResumeCtaStatusConfig
> = {
  requested: {
    label: "Resume Requested",
    ariaLabel: "Resume Requested",
    className: "resume-request__cta--requested",
  },
  sent: {
    label: "Resume Requested",
    ariaLabel: "Resume Requested",
    className: "resume-request__cta--sent",
  },
};

const Button = (): React.JSX.Element => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [status, setStatus] = useState<ResumeRequestStatus | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(false);
  const { isAuthenticated, openAuthPanel } = useAuthPanel();
  const { openResumeRequest, setResumeRequestIntent } = useResumeRequestPanel();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setStatus(null);
      setIsStatusLoading(false);
      return;
    }

    let isActive = true;
    setIsStatusLoading(true);

    const loadStatus = async () => {
      const response = await fetchResumeRequestStatus();
      if (!isActive) return;
      if (response.ok) {
        setStatus(response.status);
      } else {
        setStatus(null);
      }
      setIsStatusLoading(false);
    };

    void loadStatus();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  if (!isHydrated || (isAuthenticated && isStatusLoading)) {
    return <Skeleton />;
  }

  const statusConfig = status ? RESUME_CTA_STATUS_MAP[status] : null;

  const handleResumeClick = () => {
    if (status) return;

    trackEvent("cta_resume_click", { label: "resume", href: "resume_request" });

    if (isAuthenticated) {
      openResumeRequest("resume_cta");
      return;
    }

    const intent: ResumeRequestIntent = {
      source: "resume_intent",
      createdAt: Date.now(),
    };
    setResumeRequestIntent(intent);
    saveResumeRequestIntent(intent);
    openAuthPanel();
  };

  if (statusConfig) {
    return (
      <button
        type="button"
        className={`arrow-link resume-request__cta ${statusConfig.className}`}
        aria-label={statusConfig.ariaLabel}
        disabled
      >
        <span>{statusConfig.label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="arrow-link resume-request__cta"
      aria-label="Resume"
      onClick={handleResumeClick}
    >
      <span>resume</span>
      <ArrowIcon className="arrow-icon" />
    </button>
  );
};

export default Button;
