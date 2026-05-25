import { render, act } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import authPanelReducer, {
  loginSuccess,
  logout,
} from "@/state/slices/authPanel/slice";
import {
  saveSession,
  loadSession,
  clearSession,
  AUTH_SESSION_KEY,
} from "@/application/auth/session";
import type { AuthUser } from "@/application/auth";
import AuthProvider from "..";

const mockUseSession = jest.fn();

jest.mock("@/lib/auth-client", () => ({
  authClient: {
    useSession: () => mockUseSession(),
  },
}));

jest.mock("@/application/auth/session", () => ({
  saveSession: jest.fn(),
  loadSession: jest.fn().mockReturnValue(null),
  clearSession: jest.fn(),
  AUTH_SESSION_KEY: "auth_session",
  AUTH_SESSION_TTL_MS: 604_800_000,
}));

const mockUser: AuthUser = { email: "john@test.com", name: "John Doe" };

const createTestStore = (preloadedState?: {
  authPanel: ReturnType<typeof authPanelReducer>;
}) =>
  configureStore({
    reducer: { authPanel: authPanelReducer },
    preloadedState,
  });

describe("AuthProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockUseSession.mockReturnValue({ isPending: true, data: null });
  });

  it("calls saveSession when user is authenticated", () => {
    const store = createTestStore({
      authPanel: {
        isOpen: false,
        isAuthenticated: true,
        user: mockUser,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      </Provider>
    );

    expect(saveSession).toHaveBeenCalledWith(mockUser);
  });

  it("calls clearSession when user is not authenticated", () => {
    const store = createTestStore({
      authPanel: {
        isOpen: false,
        isAuthenticated: false,
        user: null,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      </Provider>
    );

    expect(clearSession).toHaveBeenCalled();
  });

  it("saves session after loginSuccess dispatch", () => {
    const store = createTestStore();

    render(
      <Provider store={store}>
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      </Provider>
    );

    jest.clearAllMocks();

    act(() => {
      store.dispatch(loginSuccess(mockUser));
    });

    expect(saveSession).toHaveBeenCalledWith(mockUser);
  });

  it("clears session after logout dispatch", () => {
    const store = createTestStore({
      authPanel: {
        isOpen: false,
        isAuthenticated: true,
        user: mockUser,
        error: null,
      },
    });

    render(
      <Provider store={store}>
        <AuthProvider>
          <div>child</div>
        </AuthProvider>
      </Provider>
    );

    jest.clearAllMocks();

    act(() => {
      store.dispatch(logout());
    });

    expect(clearSession).toHaveBeenCalled();
  });

  it("renders children", () => {
    const store = createTestStore();

    const { getByText } = render(
      <Provider store={store}>
        <AuthProvider>
          <div>test child</div>
        </AuthProvider>
      </Provider>
    );

    expect(getByText("test child")).toBeInTheDocument();
  });

  describe("cross-tab sync", () => {
    it("dispatches loginSuccess when storage event sets auth_session", () => {
      const store = createTestStore();

      render(
        <Provider store={store}>
          <AuthProvider>
            <div>child</div>
          </AuthProvider>
        </Provider>
      );

      // loadSession validates structure + TTL, returns user if valid
      (loadSession as jest.Mock).mockReturnValueOnce(mockUser);

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: AUTH_SESSION_KEY,
            newValue: "any-truthy-value",
          })
        );
      });

      const state = store.getState().authPanel;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it("dispatches logout when storage event removes auth_session", () => {
      const store = createTestStore({
        authPanel: {
          isOpen: false,
          isAuthenticated: true,
          user: mockUser,
          error: null,
        },
      });

      render(
        <Provider store={store}>
          <AuthProvider>
            <div>child</div>
          </AuthProvider>
        </Provider>
      );

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: AUTH_SESSION_KEY,
            newValue: null,
          })
        );
      });

      const state = store.getState().authPanel;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it("ignores storage events for other keys", () => {
      const store = createTestStore({
        authPanel: {
          isOpen: false,
          isAuthenticated: true,
          user: mockUser,
          error: null,
        },
      });

      render(
        <Provider store={store}>
          <AuthProvider>
            <div>child</div>
          </AuthProvider>
        </Provider>
      );

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "themeMode",
            newValue: "dark",
          })
        );
      });

      const state = store.getState().authPanel;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
    });

    it("dispatches logout when cross-tab session is expired (M2 fix)", () => {
      const store = createTestStore({
        authPanel: {
          isOpen: false,
          isAuthenticated: true,
          user: mockUser,
          error: null,
        },
      });

      render(
        <Provider store={store}>
          <AuthProvider>
            <div>child</div>
          </AuthProvider>
        </Provider>
      );

      // loadSession returns null for expired sessions
      (loadSession as jest.Mock).mockReturnValueOnce(null);

      act(() => {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: AUTH_SESSION_KEY,
            newValue: "expired-session-data",
          })
        );
      });

      const state = store.getState().authPanel;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });

    it("cleans up storage event listener on unmount", () => {
      const store = createTestStore();
      const removeSpy = jest.spyOn(window, "removeEventListener");

      const { unmount } = render(
        <Provider store={store}>
          <AuthProvider>
            <div>child</div>
          </AuthProvider>
        </Provider>
      );

      unmount();

      expect(removeSpy).toHaveBeenCalledWith("storage", expect.any(Function));

      removeSpy.mockRestore();
    });
  });
});
