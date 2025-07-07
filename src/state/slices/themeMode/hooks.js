import { useDispatch, useSelector } from "react-redux";
import { setTheme, toggleTheme } from "./slice";

export const useThemeMode = () => {
  const mode = useSelector((state) => state.themeMode.mode);
  const dispatch = useDispatch();

  return {
    isDark: mode === "dark",
    mode,
    setDark: () => dispatch(setTheme("dark")),
    setLight: () => dispatch(setTheme("light")),
    toggleTheme: () => dispatch(toggleTheme()),
  };
};
