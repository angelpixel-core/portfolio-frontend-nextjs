import themeModeReducer, {
  setDarkThemeMode,
  setLightThemeMode,
  toggleThemeMode,
  setThemeMode,
  getInitialTheme,
  type ThemeModeState,
  type ThemeMode,
} from "../themeMode/slice";

const LIGHT: ThemeMode = "light";
const DARK: ThemeMode = "dark";
const KEY_NAME = "themeMode";

// Helper to mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: query === "(prefers-color-scheme: dark)" ? matches : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
};

describe("themeMode slice", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should return the initial state by default (light mode)", () => {
    const state = themeModeReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual({ mode: LIGHT });
  });

  it("should set dark mode", () => {
    const initialState: ThemeModeState = { mode: LIGHT };
    const state = themeModeReducer(initialState, setDarkThemeMode());
    expect(state.mode).toBe(DARK);
  });

  it("should set light mode", () => {
    const initialState: ThemeModeState = { mode: DARK };
    const state = themeModeReducer(initialState, setLightThemeMode());
    expect(state.mode).toBe(LIGHT);
  });

  it("should toggle between light and dark", () => {
    const initialState: ThemeModeState = { mode: LIGHT };

    const darkState = themeModeReducer(initialState, toggleThemeMode());
    expect(darkState.mode).toBe(DARK);

    const lightStateAgain = themeModeReducer(darkState, toggleThemeMode());
    expect(lightStateAgain.mode).toBe(LIGHT);
  });

  it("should set theme mode with payload", () => {
    const initialState: ThemeModeState = { mode: LIGHT };
    const state = themeModeReducer(initialState, setThemeMode(DARK));
    expect(state.mode).toBe(DARK);
  });
});

describe("getInitialTheme", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("should return light mode when no localStorage and no system preference", () => {
    mockMatchMedia(false);
    const theme = getInitialTheme();
    expect(theme).toBe(LIGHT);
  });

  it("should return dark mode when system prefers dark and no localStorage", () => {
    mockMatchMedia(true);
    const theme = getInitialTheme();
    expect(theme).toBe(DARK);
  });

  it("should use localStorage over system preference (localStorage: light, system: dark)", () => {
    localStorage.setItem(KEY_NAME, LIGHT);
    mockMatchMedia(true);
    const theme = getInitialTheme();
    expect(theme).toBe(LIGHT);
  });

  it("should use localStorage over system preference (localStorage: dark, system: light)", () => {
    localStorage.setItem(KEY_NAME, DARK);
    mockMatchMedia(false);
    const theme = getInitialTheme();
    expect(theme).toBe(DARK);
  });

  describe("legacy key migration", () => {
    const LEGACY_KEY = "theme";

    it("should migrate from legacy 'theme' key to 'themeMode' key", () => {
      localStorage.setItem(LEGACY_KEY, DARK);
      mockMatchMedia(false);

      const theme = getInitialTheme();

      expect(theme).toBe(DARK);
      expect(localStorage.getItem(KEY_NAME)).toBe(DARK);
      expect(localStorage.getItem(LEGACY_KEY)).toBeNull();
    });

    it("should prefer new key over legacy key", () => {
      localStorage.setItem(KEY_NAME, LIGHT);
      localStorage.setItem(LEGACY_KEY, DARK);
      mockMatchMedia(false);

      const theme = getInitialTheme();

      expect(theme).toBe(LIGHT);
      // Legacy key should remain untouched when new key exists
      expect(localStorage.getItem(LEGACY_KEY)).toBe(DARK);
    });
  });
});
