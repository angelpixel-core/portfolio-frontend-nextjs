"use client";

import { useState, FormEvent } from "react";
import { useAuthPanel } from "@/state/slices";
import { mockSignup } from "@/services/auth";

const SignupForm = () => {
  const { loginSuccess, loginError, error, clearError } = useAuthPanel();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    if (password !== confirmPassword) {
      loginError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await mockSignup(email, password, name);
      if (result.success && result.user) {
        loginSuccess(result.user);
      } else {
        loginError(result.error || "Signup failed");
      }
    } catch {
      loginError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-error">{error}</div>}

      <div className="auth-field">
        <label htmlFor="signup-name" className="auth-label">
          Name
        </label>
        <input
          id="signup-name"
          type="text"
          className="auth-input"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="signup-email" className="auth-label">
          Email
        </label>
        <input
          id="signup-email"
          type="email"
          className="auth-input"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="signup-password" className="auth-label">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          className="auth-input"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="signup-confirm" className="auth-label">
          Confirm Password
        </label>
        <input
          id="signup-confirm"
          type="password"
          className="auth-input"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
      </div>

      <button type="submit" className="auth-submit" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
};

export default SignupForm;
