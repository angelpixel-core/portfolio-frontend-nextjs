"use client";

import "./styles.css";
import { useEffect, useRef, useState } from "react";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import UserIcon from "@/atoms/icons/UserIcon";
import { getInitials } from "@/services/auth/utils";
import { AnimatePresence, m } from "framer-motion";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";
import AuthDropdown from "./AuthDropdown";

const AuthButton = () => {
  const { isOpen, isAuthenticated, user, toggleAuthPanel, logout } =
    useAuthPanel();
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showInitials = mounted && isAuthenticated && user;

  const clientAuthenticated = mounted && isAuthenticated;

  const ariaLabel = clientAuthenticated
    ? "View account (signed in)"
    : isOpen
      ? "Close sign in panel"
      : "Open sign in panel";

  const handleClick = () => {
    if (clientAuthenticated && user) {
      setDropdownOpen((prev) => !prev);
    } else {
      toggleAuthPanel();
    }
  };

  const handleDropdownClose = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="auth_button__wrapper">
      <button
        ref={buttonRef}
        className={`auth_button focus-ring ${clientAuthenticated ? "auth_button--active" : ""}`}
        data-testid="auth-button"
        id="authButtonId"
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-expanded={clientAuthenticated ? dropdownOpen : isOpen}
        aria-controls={
          clientAuthenticated ? "authDropdown" : "authPanelFloating"
        }
        aria-haspopup={clientAuthenticated ? "true" : undefined}
      >
        <AnimatePresence mode="wait">
          {showInitials ? (
            <m.span
              key="initials"
              data-testid="auth-initials"
              className="auth_button__initials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.15 }}
            >
              {getInitials(user)}
            </m.span>
          ) : (
            <m.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.15 }}
            >
              <UserIcon className="h-7 w-7" />
            </m.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {dropdownOpen && user && (
          <AuthDropdown
            user={user}
            onLogout={logout}
            onClose={handleDropdownClose}
            triggerRef={buttonRef}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthButton;
