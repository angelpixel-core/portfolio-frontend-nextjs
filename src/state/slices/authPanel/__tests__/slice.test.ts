import reducer, {
  openAuthPanel,
  closeAuthPanel,
  toggleAuthPanel,
  loginSuccess,
  loginError,
  logout,
  clearError,
  getInitialAuthState,
  AuthPanelState,
} from "../slice";
import type { AuthUser } from "@/services/auth/types";
import { AUTH_SESSION_KEY, AUTH_SESSION_TTL_MS } from "@/services/auth/session";

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

  describe("getInitialAuthState", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("returns authenticated state when valid session exists", () => {
      const user: AuthUser = { email: "john@test.com", name: "John" };
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ user, timestamp: Date.now() })
      );

      const state = getInitialAuthState();
      expect(state).toEqual({
        isOpen: false,
        isAuthenticated: true,
        user,
        error: null,
      });
    });

    it("returns default state when no session exists", () => {
      const state = getInitialAuthState();
      expect(state).toEqual({
        isOpen: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    });

    it("returns default state when session is expired", () => {
      const expired = Date.now() - AUTH_SESSION_TTL_MS - 1;
      localStorage.setItem(
        AUTH_SESSION_KEY,
        JSON.stringify({ user: { email: "john@test.com" }, timestamp: expired })
      );

      const state = getInitialAuthState();
      expect(state).toEqual({
        isOpen: false,
        isAuthenticated: false,
        user: null,
        error: null,
      });
    });
  });
});
