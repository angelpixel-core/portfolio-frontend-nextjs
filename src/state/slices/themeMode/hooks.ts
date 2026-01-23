import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  setThemeMode,
  setDarkThemeMode,
  setLightThemeMode,
  toggleThemeMode,
  type ThemeMode,
} from "./slice";

interface UseThemeModeReturn {
  mode: ThemeMode;
  isDarkMode: boolean;
  isLightMode: boolean;
  setThemeMode: (_mode: ThemeMode) => void;
  setDarkThemeMode: () => void;
  setLightThemeMode: () => void;
  toggleThemeMode: () => void;
}

const useThemeMode = (): UseThemeModeReturn => {
  const mode = useAppSelector(
    (state: { themeMode: { mode: ThemeMode } }) => state.themeMode.mode
  );
  const dispatch = useAppDispatch();

  return {
    mode,
    isDarkMode: mode === "dark",
    isLightMode: mode === "light",
    setThemeMode: (value: ThemeMode) => dispatch(setThemeMode(value)),
    setDarkThemeMode: () => dispatch(setDarkThemeMode()),
    setLightThemeMode: () => dispatch(setLightThemeMode()),
    toggleThemeMode: () => dispatch(toggleThemeMode()),
  };
};

export default useThemeMode;
