"use client";

import "./styles.css";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import useChatPanel from "@/state/slices/chatPanel/hooks";
import useMenuPanel from "@/state/slices/menuPanel/hooks";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

const Floating = ({ id, title = "Dialog", children }) => {
  const { isOpen: isChatOpen, closeChatPanel } = useChatPanel();
  const { isOpen: isMenuOpen, closeMenuPanel } = useMenuPanel();
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  const handleClose = () => {
    if (isMenuOpen) closeMenuPanel();
    else if (isChatOpen) closeChatPanel();
  };

  const handleClickOutside = (event) => {
    const blade = containerRef.current;

    if (blade && event.target === blade) {
      handleClose();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panel = container.querySelector(".floating_panel");
    if (!panel) return;

    previouslyFocusedElementRef.current = document.activeElement;

    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    let focusableElements = Array.from(
      panel.querySelectorAll(focusableSelectors)
    );

    if (focusableElements.length === 0) {
      panel.setAttribute("tabindex", "-1");
      focusableElements = [panel];
    }

    // Focus first focusable element when overlay opens
    focusableElements[0].focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        handleClose();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen, isChatOpen]);

  return (
    <motion.div
      initial={
        shouldReduceMotion
          ? { opacity: 0, x: "-50%", y: "-50%" }
          : { scale: 0.8, opacity: 0, x: "-50%", y: "-50%" }
      }
      animate={shouldReduceMotion ? { opacity: 1 } : { scale: 1, opacity: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
      transition={
        shouldReduceMotion
          ? { duration: 0.01 }
          : { duration: 0.2, ease: "easeOut" }
      }
      id={`${id}Floating`}
      ref={containerRef}
      className="floating_container"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-dialog-title`}
      onClick={handleClickOutside}
    >
      <div className="floating_panel">
        <h2 id={`${id}-dialog-title`} className="sr-only">
          {title}
        </h2>
        {children}
      </div>
    </motion.div>
  );
};

export default Floating;
