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
  const isAuthEnabled = process.env.NEXT_PUBLIC_OAUTH_ENABLED === "true";
  const { isOpen, isAuthenticated, user, toggleAuthPanel, logout } =
    useAuthPanel();
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDisabled = !isAuthEnabled;
  const showInitials = mounted && isAuthenticated && user;

  const clientAuthenticated = mounted && isAuthenticated;

  const ariaLabel = isDisabled
    ? "Sign in (coming soon)"
    : clientAuthenticated
      ? "View account (signed in)"
      : isOpen
        ? "Close sign in panel"
        : "Open sign in panel";

  const handleClick = () => {
    if (isDisabled) return;
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
    <div className="auth__button__wrapper">
      <button
        ref={buttonRef}
        className={`auth__button focus-ring ${clientAuthenticated ? "auth__button--active" : ""} ${isDisabled ? "auth__button--disabled" : ""}`}
        data-testid="auth-button"
        id="authButtonId"
        onClick={handleClick}
        disabled={isDisabled}
        aria-label={ariaLabel}
        {...(!isDisabled && {
          "aria-expanded": clientAuthenticated ? dropdownOpen : isOpen,
          "aria-controls": clientAuthenticated
            ? "authDropdown"
            : "authPanelFloating",
          ...(clientAuthenticated && { "aria-haspopup": "true" as const }),
        })}
      >
        <AnimatePresence mode="wait">
          {showInitials ? (
            <m.span
              key="initials"
              data-testid="auth-initials"
              className="auth__button__initials"
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
