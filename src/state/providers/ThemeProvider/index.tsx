"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/state/stores/ReduxStore";

interface Props {
  children: ReactNode;
}

const DARK = "dark";
const KEY_NAME = "themeMode";

const ThemeProvider = ({ children }: Props) => {
  const mode = useSelector((state: RootState) => state.themeMode.mode);

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
