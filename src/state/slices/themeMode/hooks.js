import { useDispatch, useSelector } from "react-redux";
import { setTheme, toggleTheme } from "./slice";

const DARK = "dark";
const LIGHT = "light";

const useThemeMode = () => {
  const mode = useSelector((state) => state.themeMode.mode);
  const dispatch = useDispatch();

  return {
    mode,
    isDark: mode === DARK,
    setTheme: (value) => dispatch(setTheme(value)),
    setDark: () => dispatch(setTheme(DARK)),
    setLight: () => dispatch(setTheme(LIGHT)),
    toggle: () => dispatch(toggleTheme()),
  };
};

export default useThemeMode;
