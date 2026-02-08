import reducer, {
  openAuthPanel,
  closeAuthPanel,
  toggleAuthPanel,
  loginSuccess,
  loginError,
  logout,
  clearError,
  AuthPanelState,
} from "../slice";
import type { AuthUser } from "@/services/auth/types";

const initialState: AuthPanelState = {
  isOpen: false,
  isAuthenticated: false,
  user: null,
  error: null,
};

const mockUser: AuthUser = { email: "user@test.com", name: "Test User" };

describe("authPanelSlice", () => {
  it("returns initial state", () => {
    expect(reducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("panel controls", () => {
    it("opens the panel", () => {
      const state = reducer(initialState, openAuthPanel());
      expect(state.isOpen).toBe(true);
    });

    it("closes the panel and clears error", () => {
      const openWithError: AuthPanelState = {
        ...initialState,
        isOpen: true,
        error: "some error",
      };
      const state = reducer(openWithError, closeAuthPanel());
      expect(state.isOpen).toBe(false);
      expect(state.error).toBeNull();
    });

    it("toggles the panel", () => {
      const state1 = reducer(initialState, toggleAuthPanel());
      expect(state1.isOpen).toBe(true);

      const state2 = reducer(state1, toggleAuthPanel());
      expect(state2.isOpen).toBe(false);
    });
  });

  describe("login", () => {
    it("handles loginSuccess", () => {
      const openState: AuthPanelState = { ...initialState, isOpen: true };
      const state = reducer(openState, loginSuccess(mockUser));

      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.error).toBeNull();
      expect(state.isOpen).toBe(false);
    });

    it("handles loginError", () => {
      const state = reducer(initialState, loginError("Invalid credentials"));

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe("Invalid credentials");
    });
  });

  describe("logout", () => {
    it("clears auth state", () => {
      const loggedIn: AuthPanelState = {
        ...initialState,
        isAuthenticated: true,
        user: mockUser,
      };
      const state = reducer(loggedIn, logout());

      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe("clearError", () => {
    it("clears the error", () => {
      const withError: AuthPanelState = {
        ...initialState,
        error: "some error",
      };
      const state = reducer(withError, clearError());
      expect(state.error).toBeNull();
    });
  });
});
