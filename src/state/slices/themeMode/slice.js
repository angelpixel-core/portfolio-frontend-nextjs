import { createSlice } from "@reduxjs/toolkit";

const DARK = "dark";
const LIGHT = "light";
const THEME_KEY = "theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return LIGHT; // SSR fallback
  return localStorage.getItem(THEME_KEY) || LIGHT;
};

const initialState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "themeMode",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      const value = action.payload;
      state.mode = value;
      localStorage.setItem(THEME_KEY, value);
      document.documentElement.classList.toggle("dark", value === DARK);
    },
    toggleTheme: (state) => {
      const newValue = state.mode === DARK ? LIGHT : DARK;
      state.mode = newValue;
      localStorage.setItem(THEME_KEY, newValue);
      document.documentElement.classList.toggle("dark", newValue === DARK);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
