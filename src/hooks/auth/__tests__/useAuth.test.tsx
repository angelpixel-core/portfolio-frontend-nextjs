import React from "react";
import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authPanelReducer, {
  loginSuccess,
  loginError,
} from "@/state/slices/authPanel/slice";
import useAuth from "../useAuth";
import useUser from "../useUser";
import useIsAuthenticated from "../useIsAuthenticated";
import type { AuthUser } from "@/services/auth/types";

const createTestStore = () =>
  configureStore({
    reducer: { authPanel: authPanelReducer },
  });

const createWrapper = (store: ReturnType<typeof createTestStore>) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return Wrapper;
};

const mockUser: AuthUser = { email: "user@test.com", name: "Test User" };

describe("useAuth", () => {
  it("returns initial unauthenticated state", () => {
    const store = createTestStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("login sets authenticated state", () => {
    const store = createTestStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.login(mockUser);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it("logout clears authenticated state", () => {
    const store = createTestStore();
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    act(() => {
      result.current.login(mockUser);
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it("clearError clears the error", () => {
    const store = createTestStore();
    store.dispatch(loginError("test error"));

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(store),
    });

    expect(result.current.error).toBe("test error");

    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});

describe("useUser", () => {
  it("returns null when not authenticated", () => {
    const store = createTestStore();
    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBeNull();
  });

  it("returns user when authenticated", () => {
    const store = createTestStore();
    store.dispatch(loginSuccess(mockUser));

    const { result } = renderHook(() => useUser(), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toEqual(mockUser);
  });
});

describe("useIsAuthenticated", () => {
  it("returns false when not authenticated", () => {
    const store = createTestStore();
    const { result } = renderHook(() => useIsAuthenticated(), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBe(false);
  });

  it("returns true when authenticated", () => {
    const store = createTestStore();
    store.dispatch(loginSuccess(mockUser));

    const { result } = renderHook(() => useIsAuthenticated(), {
      wrapper: createWrapper(store),
    });

    expect(result.current).toBe(true);
  });
});
