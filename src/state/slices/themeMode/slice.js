import { createSlice } from "@reduxjs/toolkit";

const KEY_NAME = "themeMode";
const DARK = "dark";
const LIGHT = "light";
const UNDEFINED = "undefined";

const getTheme = () => {
  if (typeof window === UNDEFINED) return LIGHT;
  return localStorage.getItem(KEY_NAME) || LIGHT;
};

const initialState = {
  mode: getTheme(),
};

const themeModeSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setThemeMode: (state, action) => {
      state.mode = action.payload;

      if (typeof window !== UNDEFINED) {
        localStorage.setItem(KEY_NAME, value);
        document.documentElement.classList.toggle(DARK, value === DARK);
      }
    },
    setDark: (state) => {
      state.mode = DARK;

      if (typeof window !== UNDEFINED) {
        localStorage.setItem(KEY_NAME, DARK);
        document.documentElement.classList.add(DARK);
      }
    },
    setLight: (state) => {
      state.mode = LIGHT;

      if (typeof window !== UNDEFINED) {
        localStorage.setItem(KEY_NAME, LIGHT);
        document.documentElement.classList.remove(DARK);
      }
    },
    toggle: (state) => {
      const newValue = state.mode === DARK ? LIGHT : DARK;
      state.mode = newValue;

      if (typeof window !== UNDEFINED) {
        localStorage.setItem(KEY_NAME, newValue);
        document.documentElement.classList.toggle(DARK, newValue === DARK);
      }
    },
  },
});

export const {
  setThemeMode,
  setDark: setDarkThemeMode,
  setLight: setLightThemeMode,
  toggle: toggleThemeMode,
} = themeModeSlice.actions;

export default themeModeSlice.reducer;
