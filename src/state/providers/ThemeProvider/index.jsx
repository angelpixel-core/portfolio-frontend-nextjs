"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

const DARK = "dark";
const KEY_NAME = "themeMode";

const ThemeProvider = ({ children }) => {
  const mode = useSelector((state) => state.themeMode.mode);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    if (mode === DARK) root.classList.add(DARK);
    else root.classList.remove(DARK);

    if (typeof window !== "undefined") {
      localStorage.setItem(KEY_NAME, mode);
    }
  }, [mode]);

  return children;
};

export default ThemeProvider;
