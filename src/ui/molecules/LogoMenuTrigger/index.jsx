"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { LogoIcon } from "@/icons";
import { useReducedMotion } from "@/hooks";
import { useMenuPanel } from "@/state/slices";

/**
 * LogoMenuTrigger - Logo that acts as menu trigger on mobile.
 *
 * On mobile (<841px):
 * - Clicking toggles the menu overlay (nav + socials)
 * - Logo does NOT navigate to home (menu trigger behavior)
 *
 * On desktop (≥841px):
 * - This component is hidden (nav:hidden)
 * - The regular Logo in Menu component handles navigation
 *
 * NOTE: This replaces the hamburger menu. The Logo is now the menu trigger.
 *
 * @see _bmad-output/implementation-artifacts/ux-design-behavior/06-home-layout-rules/
 */
const LogoMenuTrigger = () => {
  const shouldReduceMotion = useReducedMotion();
  const { isOpen, toggle } = useMenuPanel();

  const handleClick = (e) => {
    e.preventDefault();
    toggle();
  };

  return (
    <div className="logo-menu-trigger">
      <motion.button
        type="button"
        onClick={handleClick}
        className="logo-menu-trigger__button focus-ring"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        whileHover={
          shouldReduceMotion
            ? undefined
            : {
                backgroundColor: [
                  "#121212",
                  "rgba(131,58,180,1)",
                  "rgba(253,29,29,1)",
                  "rgba(252,176,69,1)",
                  "rgba(131,58,180,1)",
                  "#121212",
                ],
                transition: { duration: 1, repeat: Infinity },
              }
        }
      >
        <LogoIcon />
      </motion.button>
    </div>
  );
};

export default LogoMenuTrigger;
