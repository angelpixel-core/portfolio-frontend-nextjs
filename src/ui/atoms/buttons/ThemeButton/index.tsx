"use client";

import "./styles.css";

import { MoonIcon, SunIcon } from "@/atoms/icons";
import useThemeMode from "@/state/slices/themeMode/hooks";

const ThemeButton = () => {
  const { isDarkMode, toggleThemeMode } = useThemeMode();

  const ThemeIcon = isDarkMode ? MoonIcon : SunIcon;
  const ariaLabel = isDarkMode ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      onClick={toggleThemeMode}
      className="theme-button"
      role="switch"
      aria-checked={isDarkMode}
      aria-label={ariaLabel}
    >
      <ThemeIcon className="theme-icon" />
    </button>
  );
};

export default ThemeButton;
