"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { m } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import OverlayPortal from "@/overlays/OverlayPortal";
import useHireFlow from "./useHireFlow";

interface HireFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

const HireFlowModal = ({
  isOpen,
  onClose,
  initialEmail,
}: HireFlowModalProps) => {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);
  const {
    steps,
    stepIndex,
    currentStep,
    answers,
    setAnswer,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    isCurrentStepValid,
    showError,
    clearStoredAnswers,
  } = useHireFlow({ initialEmail });

  const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (container && event.target === container) {
      onClose();
    }
  };

  const handleNext = () => {
    const isValid = nextStep();
    if (isValid && isLastStep) {
      clearStoredAnswers();
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const panel = container.querySelector(".hire-flow-panel") as HTMLElement;
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
  }, [isOpen, onClose]);

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
        data-testid="hire-flow-modal"
        id="hireFlowModal"
        ref={containerRef}
        className="hire-flow-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hire-flow-title"
        onClick={handleClickOutside}
      >
        <div className="hire-flow-panel">
          <button
            type="button"
            className="hire-flow-close"
            onClick={onClose}
            aria-label="Close dialog"
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

          <header className="hire-flow-header">
            <h2 id="hire-flow-title" className="hire-flow-title">
              {currentStep.title}
            </h2>
            <p className="hire-flow-subtitle">{currentStep.subtitle}</p>
          </header>

          <div className="hire-flow-body">
            {currentStep.render({
              answers,
              onAnswer: setAnswer,
              showError,
            })}
            <div className="hire-flow-footer">
              <div className="hire-flow-progress">
                Step {stepIndex + 1} of {steps.length}
              </div>
              <div className="hire-flow-actions">
                <button
                  type="button"
                  className="hire-flow-action hire-flow-action--demo"
                  onClick={previousStep}
                  disabled={isFirstStep}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={`hire-flow-action hire-flow-action--demo ${
                    !isCurrentStepValid && showError
                      ? "hire-flow-action--invalid"
                      : ""
                  }`}
                  onClick={handleNext}
                >
                  {isLastStep ? "Finish" : "Continue"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </m.div>
    </OverlayPortal>
  );
};

export default HireFlowModal;
