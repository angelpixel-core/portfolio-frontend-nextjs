"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthPanel from "@/state/slices/authPanel/hooks";
import { mockLogin, mockSignup } from "@/services/auth";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
}

/**
 * Unified Auth Form with smooth transitions
 *
 * Shows/hides fields based on mode with animations:
 * - Name field: slides in/out from top for signup
 * - Confirm Password: slides in/out from bottom for signup
 * - Button text: fades between "Sign In" / "Create Account"
 */
const AuthForm = ({ mode }: AuthFormProps) => {
  const { loginSuccess, loginError, error, clearError } = useAuthPanel();
  const shouldReduceMotion = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isSignup = mode === "signup";

  // Animation variants
  const fieldVariants = shouldReduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: {
          opacity: 0,
          height: 0,
          marginBottom: 0,
          overflow: "hidden",
        },
        visible: {
          opacity: 1,
          height: "auto",
          marginBottom: 16, // gap-4 = 1rem = 16px
          overflow: "hidden",
          transition: {
            height: { duration: 0.3, ease: "easeOut" },
            opacity: { duration: 0.2, delay: 0.1 },
          },
        },
        exit: {
          opacity: 0,
          height: 0,
          marginBottom: 0,
          overflow: "hidden",
          transition: {
            opacity: { duration: 0.15 },
            height: { duration: 0.25, delay: 0.1 },
          },
        },
      };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          loginError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        const result = await mockSignup(email, password, name);
        if (result.success && result.user) {
          loginSuccess(result.user);
        } else {
          loginError(result.error || "Signup failed");
        }
      } else {
        const result = await mockLogin(email, password);
        if (result.success && result.user) {
          loginSuccess(result.user);
        } else {
          loginError(result.error || "Login failed");
        }
      }
    } catch {
      loginError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {/* Error message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.2 }}
            className="auth-error"
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name field - only for signup */}
      <AnimatePresence mode="wait">
        {isSignup && (
          <motion.div
            key="name-field"
            className="auth-field"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ marginBottom: 0 }} // Controlled by animation
          >
            <label htmlFor="auth-name" className="auth-label">
              Name
            </label>
            <input
              id="auth-name"
              type="text"
              className="auth-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={isSignup}
              autoComplete="name"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email field - always visible */}
      <div className="auth-field">
        <label htmlFor="auth-email" className="auth-label">
          Email
        </label>
        <input
          id="auth-email"
          type="email"
          className="auth-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      {/* Password field - always visible */}
      <div className="auth-field">
        <label htmlFor="auth-password" className="auth-label">
          Password
        </label>
        <input
          id="auth-password"
          type="password"
          className="auth-input"
          placeholder={isSignup ? "Create a password" : "Enter your password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={isSignup ? "new-password" : "current-password"}
          minLength={isSignup ? 8 : undefined}
        />
      </div>

      {/* Confirm Password field - only for signup */}
      <AnimatePresence mode="wait">
        {isSignup && (
          <motion.div
            key="confirm-field"
            className="auth-field"
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ marginBottom: 0 }} // Controlled by animation
          >
            <label htmlFor="auth-confirm" className="auth-label">
              Confirm Password
            </label>
            <input
              id="auth-confirm"
              type="password"
              className="auth-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required={isSignup}
              autoComplete="new-password"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit button with animated text */}
      <button
        type="submit"
        data-testid="auth-form-submit"
        className="auth-submit"
        disabled={isLoading}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={isLoading ? "loading" : mode}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: shouldReduceMotion ? 0.01 : 0.15 }}
          >
            {isLoading
              ? isSignup
                ? "Subscribing..."
                : "Signing in..."
              : isSignup
                ? "Subscribe"
                : "Sign In"}
          </motion.span>
        </AnimatePresence>
      </button>
    </form>
  );
};

export default AuthForm;
