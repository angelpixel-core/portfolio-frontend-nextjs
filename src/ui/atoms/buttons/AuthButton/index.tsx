"use client";

import "./styles.css";
import { useRef, useState } from "react";
import { useAuthPanel } from "@/state/slices";
import UserIcon from "@/atoms/icons/UserIcon";
import { getInitials } from "@/services/auth";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/hooks";
import AuthDropdown from "./AuthDropdown";

const AuthButton = () => {
  const { isOpen, isAuthenticated, user, toggleAuthPanel, logout } =
    useAuthPanel();
  const shouldReduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const showInitials = isAuthenticated && user;

  const ariaLabel = isAuthenticated
    ? "View account (signed in)"
    : isOpen
      ? "Close sign in panel"
      : "Open sign in panel";

  const handleClick = () => {
    if (isAuthenticated && user) {
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
        className={`auth_button focus-ring ${isAuthenticated ? "auth_button--active" : ""}`}
        data-testid="auth-button"
        id="authButtonId"
        onClick={handleClick}
        aria-label={ariaLabel}
        aria-expanded={isAuthenticated ? dropdownOpen : isOpen}
        aria-controls={isAuthenticated ? "authDropdown" : "authPanelFloating"}
        aria-haspopup={isAuthenticated ? "true" : undefined}
      >
        <AnimatePresence mode="wait">
          {showInitials ? (
            <motion.span
              key="initials"
              data-testid="auth-initials"
              className="auth_button__initials"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.15 }}
            >
              {getInitials(user)}
            </motion.span>
          ) : (
            <motion.div
              key="icon"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.15 }}
            >
              <UserIcon className="h-7 w-7" />
            </motion.div>
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
