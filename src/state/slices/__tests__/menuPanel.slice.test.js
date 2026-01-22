import menuPanelReducer, {
  openMenuPanel,
  closeMenuPanel,
  toggleMenuPanel,
} from "../menuPanel/slice";

describe("menuPanel slice", () => {
  it("should return the initial state by default", () => {
    const state = menuPanelReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual({ isOpen: false });
  });

  it("should open the menu", () => {
    const initialState = { isOpen: false };
    const state = menuPanelReducer(initialState, openMenuPanel());
    expect(state.isOpen).toBe(true);
  });

  it("should close the menu", () => {
    const initialState = { isOpen: true };
    const state = menuPanelReducer(initialState, closeMenuPanel());
    expect(state.isOpen).toBe(false);
  });

  it("should toggle the menu from closed to open and back", () => {
    const initialState = { isOpen: false };

    const opened = menuPanelReducer(initialState, toggleMenuPanel());
    expect(opened.isOpen).toBe(true);

    const closedAgain = menuPanelReducer(opened, toggleMenuPanel());
    expect(closedAgain.isOpen).toBe(false);
  });
});
