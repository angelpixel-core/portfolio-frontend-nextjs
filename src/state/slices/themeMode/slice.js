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
    },
    setDark: (state) => {
      state.mode = DARK;
    },
    setLight: (state) => {
      state.mode = LIGHT;
    },
    toggle: (state) => {
      state.mode = state.mode === DARK ? LIGHT : DARK;
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
