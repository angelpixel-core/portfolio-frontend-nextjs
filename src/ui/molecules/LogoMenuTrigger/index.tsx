"use client";

import React from "react";

import "./styles.css";

import LogoCube from "@/molecules/LogoCube";
import useMenuPanel from "@/state/slices/menuPanel/hooks";

const MOBILE_LOGO_TRIGGER_FACES = {
  front: "A",
  back: "P",
  top: "I",
  bottom: "X",
  left: "E",
  right: "L",
} as const;

/**
 * LogoMenuTrigger - Logo that acts as menu trigger on mobile.
 *
 * On mobile (<880px):
 * - Clicking toggles the menu overlay (nav + socials)
 * - Logo does NOT navigate to home (menu trigger behavior)
 *
 * On desktop (≥880px):
 * - This component is hidden (navContent:hidden)
 * - The regular Logo in Menu component handles navigation
 *
 * NOTE: This replaces the hamburger menu. The Logo is now the menu trigger.
 *
 * @see _bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/
 */
const LogoMenuTrigger = (): React.JSX.Element => {
  const { isOpen, toggleMenuPanel } = useMenuPanel();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    toggleMenuPanel();
  };

  return (
    <div className="logo-menu-trigger">
      <button
        type="button"
        onClick={handleClick}
        className="logo-menu-trigger__button focus-ring"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <LogoCube
          className="logo-menu-trigger__cube"
          faces={MOBILE_LOGO_TRIGGER_FACES}
          size={38}
        />
      </button>
    </div>
  );
};

export default LogoMenuTrigger;
