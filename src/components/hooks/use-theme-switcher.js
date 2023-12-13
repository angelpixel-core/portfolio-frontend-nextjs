import { useEffect, useState } from "react";

export default function useThemeSwitcher() {
  const DARK = "dark";
  const LIGHT = "light";

  const prefersDarkQuery = "(prefers-color-schema: dark)";
  const [mode, setMode] = useState("");

  useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkQuery);
    const userPref = window.localStorage.getItem("theme");

    const handleChange = () => {
      if (userPref) {
        let check = userPref === DARK ? DARK : LIGHT;
        setMode(check);

        if (check === DARK) {
          document.documentElement.classList.add(DARK);
        } else {
          document.documentElement.classList.remove(DARK);
        }
      } else {
        let check = mediaQuery.matches ? DARK : LIGHT;
        setMode(check);

        if (check === DARK) {
          document.documentElement.classList.add(DARK);
        } else {
          document.documentElement.classList.remove(DARK);
        }
      }
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.addEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (mode === DARK) {
      window.localStorage.setItem("theme", DARK);
      document.documentElement.classList.add(DARK);
    } else {
      window.localStorage.setItem("theme", LIGHT);
      document.documentElement.classList.remove(DARK);
    }
  }, [mode]);

  return [mode, setMode];
}
