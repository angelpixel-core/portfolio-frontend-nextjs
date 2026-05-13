"use client";

import "./styles.css";

import { trackEvent } from "@/observability/analytics";
import { saveHireFlowIntent } from "@/services/hireFlow/intent";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import useHireFlowPanel from "@/state/slices/hireFlowPanel/hooks";
import type { HireFlowIntent } from "@/state/slices/hireFlowPanel";

interface HireMeButtonProps {
  className?: string;
}

const HireMeButton = ({ className = "" }: HireMeButtonProps) => {
  const { isAuthenticated, openAuthPanel } = useAuthPanel();
  const { openHireFlow, setHireFlowIntent } = useHireFlowPanel();

  const handleClick = () => {
    const intent: HireFlowIntent = {
      source: "hire_me_section",
      createdAt: Date.now(),
    };

    trackEvent("cta_contact_click", {
      label: "hire me",
      href: "hire_flow",
    });

    if (isAuthenticated) {
      openHireFlow();
      return;
    }

    setHireFlowIntent(intent);
    saveHireFlowIntent(intent);
    openAuthPanel();
  };

  return (
    <button
      type="button"
      className={`${className} hire-me__about-container focus-ring`}
      onClick={handleClick}
    >
      <span className="hire-me__label text-2xl font-bold font-orbitron">
        <span>Let&apos;s talk</span>
        <span className="hire-me__label-arrow" aria-hidden="true">
          &rarr;
        </span>
      </span>
    </button>
  );
};

export default HireMeButton;
