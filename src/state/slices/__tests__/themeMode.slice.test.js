import themeModeReducer, {
  setDarkThemeMode,
  setLightThemeMode,
  toggleThemeMode,
} from "../themeMode/slice";

const LIGHT = "light";
const DARK = "dark";

describe("themeMode slice", () => {
  it("should return the initial state by default (light mode)", () => {
    const state = themeModeReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual({ mode: LIGHT });
  });

  it("should set dark mode", () => {
    const initialState = { mode: LIGHT };
    const state = themeModeReducer(initialState, setDarkThemeMode());
    expect(state.mode).toBe(DARK);
  });

  it("should set light mode", () => {
    const initialState = { mode: DARK };
    const state = themeModeReducer(initialState, setLightThemeMode());
    expect(state.mode).toBe(LIGHT);
  });

  it("should toggle between light and dark", () => {
    const initialState = { mode: LIGHT };

    const darkState = themeModeReducer(initialState, toggleThemeMode());
    expect(darkState.mode).toBe(DARK);

    const lightStateAgain = themeModeReducer(darkState, toggleThemeMode());
    expect(lightStateAgain.mode).toBe(LIGHT);
  });
});
