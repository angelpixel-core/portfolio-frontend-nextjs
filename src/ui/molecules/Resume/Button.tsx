"use client";

import React, { useCallback, useEffect, useState } from "react";
import ArrowIcon from "@/atoms/icons/ArrowIcon";
import CheckIcon from "@/atoms/icons/CheckIcon";
import LoaderIcon from "@/atoms/icons/LoaderIcon";
import { useProfile } from "@/domains/profile/queries";
import Skeleton from "@/buttons/ArrowButton/skeleton";
import { trackEvent } from "@/services/analytics";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import {
  clearResumeRequestIntent,
  loadResumeRequestIntent,
  saveResumeRequestIntent,
} from "@/services/resumeRequest/intent";
import {
  fetchResumeRequestStatus,
  submitResumeRequest,
  ResumeRequestStatus,
  ResumeRequestSource,
} from "@/services/resumeRequest/api";

import "@/buttons/ArrowButton/styles.css";
import "./styles.css";

const Button = (): React.JSX.Element => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [resumeStatus, setResumeStatus] = useState<ResumeRequestStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: profile, isLoading, isError } = useProfile(1);
  const { isAuthenticated, openAuthPanel } = useAuthPanel();

  const refreshStatus = useCallback(async () => {
    const status = await fetchResumeRequestStatus();
    setResumeStatus(status);
  }, []);

  const submitRequest = useCallback(
    async (source: ResumeRequestSource) => {
      if (isSubmitting) return;
      setIsSubmitting(true);
      const result = await submitResumeRequest(source);
      if (result.ok) {
        setResumeStatus(result.status ?? "requested");
      }
      setIsSubmitting(false);
    },
    [isSubmitting]
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isLoading || isError || !profile) {
      return;
    }

    if (!isAuthenticated || !isHydrated) {
      setResumeStatus(null);
      return;
    }

    void refreshStatus();
  }, [isAuthenticated, isHydrated, isLoading, isError, profile, refreshStatus]);

  useEffect(() => {
    if (isLoading || isError || !profile) return;
    if (!isAuthenticated || !isHydrated || isSubmitting) return;
    const intent = loadResumeRequestIntent();
    if (!intent) return;
    if (resumeStatus) {
      clearResumeRequestIntent();
      return;
    }

    void submitRequest("resume_intent").finally(() => {
      clearResumeRequestIntent();
    });
  }, [
    isAuthenticated,
    isHydrated,
    isLoading,
    isError,
    profile,
    isSubmitting,
    resumeStatus,
    submitRequest,
  ]);

  if (!isHydrated || isLoading) {
    return <Skeleton />;
  }

  if (isError || !profile) {
    return <Skeleton />;
  }

  const handleResumeClick = () => {
    trackEvent("cta_resume_click", { label: "resume", href: "resume_request" });

    if (resumeStatus || isSubmitting) return;

    if (!isAuthenticated) {
      const intent = { source: "resume_cta" as const, createdAt: Date.now() };
      saveResumeRequestIntent(intent);
      openAuthPanel();
      return;
    }

    void submitRequest("resume_cta");
  };

  const isDisabled = Boolean(resumeStatus);
  const label = isDisabled
    ? "CV Requested"
    : isSubmitting
      ? "Requesting CV"
      : "Request CV";

  return (
    <button
      type="button"
      data-testid="resume-request-cta"
      className={`arrow-link resume-request__cta${
        isDisabled ? " resume-request__cta--disabled" : ""
      }`}
      aria-label={label}
      title={label}
      onClick={handleResumeClick}
      disabled={isDisabled || isSubmitting}
    >
      {label}
      {isSubmitting ? (
        <span className="resume-request__cta-icon resume-request__cta-icon--loader">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <LoaderIcon />
          </svg>
        </span>
      ) : isDisabled ? (
        <CheckIcon className="resume-request__cta-icon" />
      ) : (
        <ArrowIcon className="resume-request__cta-icon" />
      )}
    </button>
  );
};

export default Button;
