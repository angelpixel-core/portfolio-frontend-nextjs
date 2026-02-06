"use client";

import { useState, useEffect } from "react";
import "./styles.css";

import { MoonIcon, SunIcon } from "@/atoms/icons";
import useThemeMode from "@/state/slices/themeMode/hooks";

/**
 * ThemeButton - Toggle between light and dark mode
 *
 * Uses defer rendering pattern to avoid SSR hydration mismatch.
 * The icon is only rendered after client-side mount to ensure
 * server and client render the same initial HTML.
 *
 * @see https://nextjs.org/docs/messages/react-hydration-error
 */
const ThemeButton = () => {
  const [mounted, setMounted] = useState(false);
  const { isDarkMode, toggleThemeMode } = useThemeMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const ariaLabel = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

  // Defer icon rendering until after hydration to prevent mismatch
  // Server renders empty button, client hydrates with correct icon
  if (!mounted) {
    return (
      <button
        className="theme-button focus-ring"
        role="switch"
        aria-checked={false}
        aria-label="Toggle theme"
        data-testid="theme-toggle-button"
      >
        {/* Placeholder maintains layout during hydration */}
        <span className="theme-icon" aria-hidden="true" />
      </button>
    );
  }

  const ThemeIcon = isDarkMode ? MoonIcon : SunIcon;

  return (
    <button
      onClick={toggleThemeMode}
      className="theme-button focus-ring"
      role="switch"
      aria-checked={isDarkMode}
      aria-label={ariaLabel}
      data-testid="theme-toggle-button"
    >
      <ThemeIcon className="theme-icon" />
    </button>
  );
};

export default ThemeButton;
