import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const KEY_NAME = "themeMode";
const DARK = "dark" as const;
const LIGHT = "light" as const;

export type ThemeMode = typeof DARK | typeof LIGHT;

export interface ThemeModeState {
  mode: ThemeMode;
}

const LEGACY_KEY_NAME = "theme"; // Old key used by previous ThemeButton

/**
 * Get initial theme based on:
 * 1. localStorage preference (highest priority)
 * 2. Legacy localStorage key migration
 * 3. System preference (prefers-color-scheme)
 * 4. Default to light mode
 */
export const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return LIGHT;

  // Check current localStorage key first (user preference takes priority)
  const storedTheme = localStorage.getItem(KEY_NAME) as ThemeMode | null;
  if (storedTheme === DARK || storedTheme === LIGHT) {
    return storedTheme;
  }

  // Migrate from legacy key if exists
  const legacyTheme = localStorage.getItem(LEGACY_KEY_NAME) as ThemeMode | null;
  if (legacyTheme === DARK || legacyTheme === LIGHT) {
    // Migrate to new key and remove legacy
    localStorage.setItem(KEY_NAME, legacyTheme);
    localStorage.removeItem(LEGACY_KEY_NAME);
    return legacyTheme;
  }

  // Check system preference
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return DARK;
  }

  return LIGHT;
};

const initialState: ThemeModeState = {
  mode: getInitialTheme(),
};

const themeModeSlice = createSlice({
  name: KEY_NAME,
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
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
