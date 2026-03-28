import reducer, {
  openHireFlow,
  closeHireFlow,
  setHireFlowIntent,
  clearHireFlowIntent,
  HireFlowPanelState,
} from "../slice";

describe("hireFlowPanel slice", () => {
  const initialState: HireFlowPanelState = {
    isOpen: false,
    pendingIntent: null,
  };

  it("returns initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("opens the hire flow", () => {
    const state = reducer(initialState, openHireFlow());
    expect(state.isOpen).toBe(true);
  });

  it("closes the hire flow", () => {
    const openState: HireFlowPanelState = {
      ...initialState,
      isOpen: true,
    };
    const state = reducer(openState, closeHireFlow());
    expect(state.isOpen).toBe(false);
  });

  it("sets pending intent", () => {
    const intent = { source: "hire_me_header" as const, createdAt: 123 };
    const state = reducer(initialState, setHireFlowIntent(intent));
    expect(state.pendingIntent).toEqual(intent);
  });

  it("clears pending intent", () => {
    const stateWithIntent: HireFlowPanelState = {
      ...initialState,
      pendingIntent: { source: "hire_me_section" as const, createdAt: 456 },
    };
    const state = reducer(stateWithIntent, clearHireFlowIntent());
    expect(state.pendingIntent).toBeNull();
  });
});
