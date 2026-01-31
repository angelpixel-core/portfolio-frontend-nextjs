"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthPanel } from "@/state/slices";
import { useReducedMotion } from "@/hooks";
import { LoginForm, SignupForm, OAuthButtons } from "./Form";

type AuthTab = "login" | "signup";

const AuthModal = () => {
  const { isOpen, isAuthenticated, user, close, logout } = useAuthPanel();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<AuthTab>("login");

  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  const handleClickOutside = (event: React.MouseEvent) => {
    const container = containerRef.current;
    if (container && event.target === container) {
      close();
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
        close();
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
  }, [isOpen, close]);

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
            onClick={close}
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
          onClick={close}
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
            {activeTab === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p className="auth-subtitle">
            {activeTab === "login"
              ? "Sign in to your account"
              : "Get started with your account"}
          </p>
        </div>

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
        </div>

        {activeTab === "login" ? <LoginForm /> : <SignupForm />}

        <div className="auth-divider">
          <span className="auth-divider-line" />
          <span className="auth-divider-text">or continue with</span>
          <span className="auth-divider-line" />
        </div>

        <OAuthButtons />
      </div>
    </motion.div>
  );
};

export default AuthModal;
