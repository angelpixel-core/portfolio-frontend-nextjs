"use client";

import "./styles.css";
import { m } from "framer-motion";
import { useEffect, useRef, type ReactNode, type MouseEvent } from "react";
import OverlayPortal from "@/overlays/OverlayPortal";

import useChatPanel from "@/state/slices/chatPanel/hooks";
import useMenuPanel from "@/state/slices/menuPanel/hooks";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

interface FloatingProps {
  id: string;
  title?: string;
  children: ReactNode;
  onRequestClose?: () => void;
  closeOnOutsideClick?: boolean;
}

const Floating = ({
  id,
  title = "Dialog",
  children,
  onRequestClose,
  closeOnOutsideClick = true,
}: FloatingProps) => {
  const { isOpen: isChatOpen, closeChatPanel } = useChatPanel();
  const { isOpen: isMenuOpen, closeMenuPanel } = useMenuPanel();
  const shouldReduceMotion = useReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const handleClose = () => {
    if (onRequestClose) {
      onRequestClose();
      return;
    }

    if (isMenuOpen) closeMenuPanel();
    else if (isChatOpen) closeChatPanel();
  };

  const handleClickOutside = (event: MouseEvent<HTMLDivElement>) => {
    const blade = containerRef.current;

    if (closeOnOutsideClick && blade && event.target === blade) {
      handleClose();
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panel = container.querySelector(".floating__panel");
    if (!panel) return;

    previouslyFocusedElementRef.current =
      document.activeElement as HTMLElement | null;

    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    let focusableElements: HTMLElement[] = Array.from(
      panel.querySelectorAll<HTMLElement>(focusableSelectors)
    );

    if (focusableElements.length === 0) {
      panel.setAttribute("tabindex", "-1");
      focusableElements = [panel as HTMLElement];
    }

    // Focus first focusable element when overlay opens
    focusableElements[0].focus();

    const handleKeyDown = (event: KeyboardEvent) => {
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
    <OverlayPortal>
      <m.div
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
        className="floating__container"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-dialog-title`}
        onClick={handleClickOutside}
      >
        <div className="floating__panel">
          <h2 id={`${id}-dialog-title`} className="sr-only">
            {title}
          </h2>
          {children}
        </div>
      </m.div>
    </OverlayPortal>
  );
};

export default Floating;
