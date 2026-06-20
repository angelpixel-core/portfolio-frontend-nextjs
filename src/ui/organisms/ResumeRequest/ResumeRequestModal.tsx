"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import {
  submitResumeRequest,
  type ResumeRequestPayload,
} from "@/application/resumeRequest/client";
import { getRecaptchaToken } from "@/lib/recaptcha";
import type { ResumeRequestIntentSource } from "@/state/slices/resumeRequestPanel";
import OverlayPortal from "@/overlays/OverlayPortal";
import useResumeRequestFlow from "./useResumeRequestFlow";

interface ResumeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: ResumeRequestIntentSource;
}

const getErrorMessage = (
  error?:
    | "unauthenticated"
    | "already_requested"
    | "invalid"
    | "recaptcha_invalid"
    | "recaptcha_failed"
    | "provider_error"
) => {
  switch (error) {
    case "already_requested":
      return "You already requested a resume. I will follow up shortly.";
    case "unauthenticated":
      return "Please sign in to request a resume.";
    case "invalid":
      return "Some of the details look off. Please review and try again.";
    case "recaptcha_invalid":
    case "recaptcha_failed":
      return "We could not verify this request. Please try again.";
    default:
      return "Something went wrong. Please try again shortly.";
  }
};

const ResumeRequestModal = ({
  isOpen,
  onClose,
  source,
}: ResumeRequestModalProps) => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    steps,
    stepIndex,
    currentStep,
    answers,
    setAnswer,
    nextStep,
    previousStep,
    skipStep,
    resetFlow,
    isFirstStep,
    isLastStep,
  } = useResumeRequestFlow();

  const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (container && event.target === container) {
      onClose();
    }
  };

  const payload = useMemo<ResumeRequestPayload>(() => {
    const trimmedContext = answers.context?.trim();
    const trimmedRole = answers.role?.trim();
    const trimmedNotes = answers.notes?.trim();

    return {
      source,
      ...(trimmedContext ? { context: trimmedContext } : {}),
      ...(trimmedRole ? { role: trimmedRole } : {}),
      ...(trimmedNotes ? { notes: trimmedNotes } : {}),
    };
  }, [answers.context, answers.role, answers.notes, source]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    let recaptchaToken: string;
    try {
      recaptchaToken = await getRecaptchaToken("resume_request");
    } catch {
      setSubmitError("We could not verify this request. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const response = await submitResumeRequest({
      ...payload,
      recaptchaToken,
      recaptchaAction: "resume_request",
    });
    if (response.ok) {
      setIsSubmitting(false);
      resetFlow();
      onClose();
      return;
    }

    setSubmitError(getErrorMessage(response.error));
    setIsSubmitting(false);
  };

  const handleNext = () => {
    if (isLastStep) {
      void handleSubmit();
      return;
    }
    nextStep();
  };

  const handleSkip = () => {
    if (isLastStep) {
      void handleSubmit();
      return;
    }
    skipStep();
  };

  useEffect(() => {
    if (!isOpen) {
      resetFlow();
      setSubmitError(null);
      setIsSubmitting(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const panel = container.querySelector(
      ".resume-request-panel"
    ) as HTMLElement | null;
    if (!panel) return;

    previouslyFocusedElementRef.current =
      document.activeElement as HTMLElement | null;

    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    let focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    if (focusableElements.length === 0) {
      panel.setAttribute("tabindex", "-1");
      focusableElements = [panel as HTMLElement];
    }

    focusableElements[0].focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === "Tab" && focusableElements.length > 0) {
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        const currentlyFocused = document.activeElement;

        if (event.shiftKey) {
          if (currentlyFocused === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (currentlyFocused === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const prev = previouslyFocusedElementRef.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus();
      }
    };
  }, [isOpen, onClose, resetFlow]);

  if (!isOpen) return null;

  return (
    <OverlayPortal>
      <m.div
        initial={
          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }
        }
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.2 }}
        data-testid="resume-request-modal"
        id="resumeRequestModal"
        ref={containerRef}
        className="resume-request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-request-title"
        onClick={handleClickOutside}
      >
        <div className="resume-request-panel">
          <button
            type="button"
            className="resume-request-close"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isSubmitting}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <header className="resume-request-header">
            <h2 id="resume-request-title" className="resume-request-title">
              {currentStep.title}
            </h2>
            <p className="resume-request-subtitle">{currentStep.subtitle}</p>
          </header>

          <div className="resume-request-body">
            {currentStep.render({
              answers,
              onAnswer: setAnswer,
            })}
            {submitError ? (
              <p className="resume-request-error" role="alert">
                {submitError}
              </p>
            ) : null}
            <div className="resume-request-footer">
              <div className="resume-request-progress">
                Step {stepIndex + 1} of {steps.length}
              </div>
              <div className="resume-request-actions">
                <button
                  type="button"
                  className="resume-request-action resume-request-action--secondary"
                  onClick={previousStep}
                  disabled={isFirstStep || isSubmitting}
                >
                  Back
                </button>
                {currentStep.isOptional ? (
                  <button
                    type="button"
                    className="resume-request-action resume-request-action--ghost"
                    onClick={handleSkip}
                    disabled={isSubmitting}
                  >
                    Skip for now
                  </button>
                ) : null}
                <button
                  type="button"
                  className="resume-request-action resume-request-action--primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  {isLastStep
                    ? isSubmitting
                      ? "Sending..."
                      : "Send request"
                    : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </m.div>
    </OverlayPortal>
  );
};

export default ResumeRequestModal;
