import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  setThemeMode,
  setDarkThemeMode,
  setLightThemeMode,
  toggleThemeMode,
} from "./slice";

const DARK = "dark";
const LIGHT = "light";

const useThemeMode = () => {
  const mode = useSelector((state) => state.themeMode.mode);
  const dispatch = useDispatch();

  return {
    mode,
    isDarkMode: mode === DARK,
    isLightMode: mode === LIGHT,
    setThemeMode: (value) => dispatch(setThemeMode(value)),
    setDarkThemeMode: () => dispatch(setDarkThemeMode()),
    setLightThemeMode: () => dispatch(setLightThemeMode()),
    toggleThemeMode: () => dispatch(toggleThemeMode()),
  };
};

export default useThemeMode;
