import { createSlice } from "@reduxjs/toolkit";

export const LIGHT = "light";
export const DARK = "dark";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    theme: LIGHT,
  },
  reducers: {
    setTheme: (state, newTheme) => {
      if (newTheme !== LIGHT && newTheme !== DARK) return;

      state.theme = newTheme;
    },
    toggle: (state) => {
      if (state.theme === LIGHT) state.theme = DARK;
      else state.theme = LIGHT;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setTheme, toggle } = themeSlice.actions;
