"use client";

import React from "react";

import "./styles.css";

import LogoIcon from "@/icons/LogoIcon";
import useMenuPanel from "@/state/slices/menuPanel/hooks";

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
        <LogoIcon />
      </button>
    </div>
  );
};

export default LogoMenuTrigger;
