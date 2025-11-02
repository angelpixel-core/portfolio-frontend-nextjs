"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";

const DARK = "dark";

const ThemeProvider = ({ children }) => {
  const mode = useSelector((state) => state.themeMode.mode);

  useEffect(() => {
    if (mode === DARK) document.documentElement.classList.add(DARK);
    else document.documentElement.classList.remove(DARK);
  }, [mode]);

  return children;
};

export default ThemeProvider;
