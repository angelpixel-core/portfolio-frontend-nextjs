"use client";

import "./styles.css";

import { useEffect, useState } from "react";

import { MoonIcon, SunIcon } from "@/atoms/icons/_index";

const DARK = "dark";
const LIGHT = "light";
const THEME_KEY = "theme";

export const ThemeButton = () => {
  const [darkMode, setDarkMode] = useState();
  const ThemeIcon = darkMode ? MoonIcon : SunIcon;

  const initializeTheme = () => {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === DARK) setDarkMode(true);
  };

  const updateTheme = () => {
    if (darkMode === true) {
      document.documentElement.classList.add(DARK);
      localStorage.setItem(THEME_KEY, DARK);
    } else {
      document.documentElement.classList.remove(DARK);
      localStorage.setItem(THEME_KEY, LIGHT);
    }
  };

  useEffect(initializeTheme, []);
  useEffect(updateTheme, [darkMode]);

  return (
    <button onClick={() => setDarkMode(!darkMode)} className="theme-button">
      <ThemeIcon className="theme-icon" />
    </button>
  );
};
