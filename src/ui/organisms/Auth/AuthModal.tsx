"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthPanel } from "@/state/slices";
import { useReducedMotion } from "@/hooks";
import { performOAuthLogin } from "@/services/auth";
import type { OAuthProvider } from "@/services/auth";
import { AuthForm, OAuthButtons } from "./Form";

type AuthTab = "login" | "signup";

const AuthModal = () => {
  const {
    isOpen,
    isAuthenticated,
    user,
    closeAuthPanel,
    logout,
    loginSuccess,
    loginError,
    clearError,
  } = useAuthPanel();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [oauthLoading, setOauthLoading] = useState(false);

  const handleOAuthClick = useCallback(
    async (provider: OAuthProvider) => {
      clearError();
      setOauthLoading(true);

      try {
        const result = await performOAuthLogin(provider);
        if (result.success && result.user) {
          loginSuccess(result.user);
          closeAuthPanel();
        } else {
          loginError(result.error || "OAuth login failed");
        }
      } catch {
        loginError("An unexpected error occurred");
      } finally {
        setOauthLoading(false);
      }
    },
    [clearError, loginSuccess, loginError, closeAuthPanel]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const handleClickOutside = (event: React.MouseEvent) => {
    const container = containerRef.current;
    if (container && event.target === container) {
      closeAuthPanel();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const panel = container.querySelector(".auth-panel") as HTMLElement;
    if (!panel) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement;

    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusableElements = Array.from(
      panel.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        closeAuthPanel();
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
  }, [isOpen, closeAuthPanel]);

  if (!isOpen) return null;

  // Show user info if authenticated
  if (isAuthenticated && user) {
    return (
      <motion.div
        initial={
          shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
        }
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.2 }}
        ref={containerRef}
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        onClick={handleClickOutside}
      >
        <div className="auth-panel relative">
          <button
            className="auth-close"
            onClick={closeAuthPanel}
            aria-label="Close dialog"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="auth-header">
            <h2 id="auth-dialog-title" className="auth-title">
              Welcome back!
            </h2>
            <p className="auth-subtitle">Signed in as {user.email}</p>
          </div>

          <button
            type="button"
            className="auth-submit bg-red-600 hover:bg-red-700"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={
        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }
      }
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 0.2 }}
      id="authPanelFloating"
      ref={containerRef}
      className="auth-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
      onClick={handleClickOutside}
    >
      <div className="auth-panel relative">
        <button
          className="auth-close"
          onClick={closeAuthPanel}
          aria-label="Close dialog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Animated Header */}
        <div className="auth-header">
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeTab === "login" ? "title-login" : "title-signup"}
              id="auth-dialog-title"
              className="auth-title"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
            >
              {activeTab === "login" ? "Welcome back" : "Register"}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab === "login" ? "sub-login" : "sub-signup"}
              className="auth-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.01 : 0.15 }}
            >
              {activeTab === "login"
                ? "Sign in to your account"
                : "Get started with your account"}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Tab Switcher with animated indicator */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${activeTab === "login" ? "auth-tab--active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${activeTab === "signup" ? "auth-tab--active" : ""}`}
            onClick={() => setActiveTab("signup")}
          >
            Sign Up
          </button>
          {/* Animated pill indicator */}
          <motion.div
            className="auth-tab-indicator"
            layoutId="auth-tab-indicator"
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              duration: shouldReduceMotion ? 0.01 : undefined,
            }}
            style={{
              left: activeTab === "login" ? "4px" : "50%",
            }}
          />
        </div>

        {/* Unified Form with smooth field transitions */}
        <AuthForm mode={activeTab} />

        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or continue with</span>
          <span className="auth-divider-line" />
        </div>

        <OAuthButtons onOAuthClick={handleOAuthClick} disabled={oauthLoading} />
      </div>
    </motion.div>
  );
};

export default AuthModal;
