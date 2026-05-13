"use client";

import "./styles.css";

import { trackEvent } from "@/observability/analytics";
import { saveHireFlowIntent } from "@/services/hireFlow/intent";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import useHireFlowPanel from "@/state/slices/hireFlowPanel/hooks";
import type { HireFlowIntent } from "@/state/slices/hireFlowPanel";

/**
 * HireMeHeaderButton - Compact Hire Me button for mobile header.
 *
 * Story 12.2: Mobile header layout requires hamburger (left), logo (center), Hire Me (right).
 *
 * Visibility:
 * - Visible on mobile (<800px)
 * - Hidden on nav+ (≥800px) where full Menu is visible
 *
 * @see docs/layout-system.md for visibility matrix
 */
const HireMeHeaderButton = () => {
  const { isAuthenticated, openAuthPanel } = useAuthPanel();
  const { openHireFlow, setHireFlowIntent } = useHireFlowPanel();

  const handleClick = () => {
    const intent: HireFlowIntent = {
      source: "hire_me_header",
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
      className="hire-me-header focus-ring"
      data-testid="header-hire-me-zone"
      aria-label="Hire me"
      onClick={handleClick}
    >
      <span className="hire-me-header__text font-orbitron">
        Let&apos;s talk
      </span>
    </button>
  );
};

export default HireMeHeaderButton;
