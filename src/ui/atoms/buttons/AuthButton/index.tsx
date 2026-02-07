"use client";

import "./styles.css";
import { useAuthPanel } from "@/state/slices";
import { UserIcon } from "@/icons";

const AuthButton = () => {
  const { isOpen, isAuthenticated, toggleAuthPanel } = useAuthPanel();

  const ariaLabel = isAuthenticated
    ? "View account (signed in)"
    : isOpen
      ? "Close sign in panel"
      : "Open sign in panel";

  return (
    <button
      className={`auth_button focus-ring ${isAuthenticated ? "auth_button--active" : ""}`}
      id="authButtonId"
      onClick={toggleAuthPanel}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="authPanelFloating"
    >
      <UserIcon className="h-7 w-7" />
      <span className="sr-only">{ariaLabel}</span>
    </button>
  );
};

export default AuthButton;
