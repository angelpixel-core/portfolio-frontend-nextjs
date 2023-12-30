"use client";

import { useEffect, useState } from "react";

import MoonIcon from "@/atoms/icons/moon-icon";
import SunIcon from "@/atoms/icons/sun-icon";

const DARK = "dark";
const LIGHT = "light";

function useThemeSwitcher() {
  const prefersDarkQuery = "(prefers-color-schema: dark)";
  const [mode, setMode] = useState("");

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkQuery);
    const userPref = window.localStorage.getItem("theme");

    const handleChange = () => {
      let check = (function (themePref, themeQuery) {
        if (userPref) return userPref === DARK ? DARK : LIGHT;
        else return mediaQuery.matches ? DARK : LIGHT;
      })(userPref, mediaQuery);

      setMode(check);

      if (check === DARK) document.documentElement.classList.add(DARK);
      else document.documentElement.classList.remove(DARK);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.addEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (mode === DARK) {
      window.localStorage.setItem("theme", DARK);
      document.documentElement.classList.add(DARK);
    }

    if (mode === LIGHT) {
      window.localStorage.setItem("theme", LIGHT);
      document.documentElement.classList.remove(DARK);
    }
  }, [mode]);

  return [mode, setMode];
}

export default function ThemeSwitcherButton({}) {
  const [mode, setMode] = useThemeSwitcher();

  return (
    <button
      onClick={() => setMode(mode === LIGHT ? DARK : LIGHT)}
      className="
        flex
        items-center
        justify-center
        rounded-full
        p-1
        ml-3 sm:ml-1
        bg-dark dark:bg-light
        text-light dark:text-dark
      "
    >
      {mode === DARK ? (
        <MoonIcon className="fill-dark" />
      ) : (
        <SunIcon className="fill-dark" />
      )}
    </button>
  );
}

export function loadThemeSwitcher() {
  return () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
}
