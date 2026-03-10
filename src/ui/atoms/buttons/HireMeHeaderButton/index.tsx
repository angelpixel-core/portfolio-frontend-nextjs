"use client";

import "./styles.css";

import Link from "next/link";
import { useProfile } from "@/domains/profile/queries";

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
  const { data: profile, isLoading, isError } = useProfile(1);

  if (isLoading) {
    return (
      <div
        className="hire-me-header focus-ring"
        data-testid="header-hire-me-zone"
        aria-label="Loading contact"
      >
        <span className="hire-me-header__text">...</span>
      </div>
    );
  }

  if (isError || !profile?.telegram) {
    return null;
  }

  return (
    <Link
      href={profile.telegram}
      target="_blank"
      rel="noopener noreferrer"
      className="hire-me-header focus-ring"
      data-testid="header-hire-me-zone"
      aria-label="Hire me - opens Telegram"
    >
      <span className="hire-me-header__text font-orbitron">
        Let&apos;s talk
      </span>
    </Link>
  );
};

export default HireMeHeaderButton;
