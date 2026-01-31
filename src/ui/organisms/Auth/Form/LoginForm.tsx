"use client";

import { useState, FormEvent } from "react";
import { useAuthPanel } from "@/state/slices";
import { mockLogin } from "@/services/auth";

const LoginForm = () => {
  const { loginSuccess, loginError, error, clearError } = useAuthPanel();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();

    try {
      const result = await mockLogin(email, password);
      if (result.success && result.user) {
        loginSuccess(result.user);
      } else {
        loginError(result.error || "Login failed");
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
        <label htmlFor="login-email" className="auth-label">
          Email
        </label>
        <input
          id="login-email"
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
        <label htmlFor="login-password" className="auth-label">
          Password
        </label>
        <input
          id="login-password"
          type="password"
          className="auth-input"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      <button type="submit" className="auth-submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
