import React from "react";
import { render, waitFor } from "@testing-library/react";
import { RootProvider } from "@/application/providers/root";
import { initPlausible } from "@/observability/analytics";

jest.mock("@/observability/analytics", () => ({
  initPlausible: jest.fn(),
}));

jest.mock("@/state/providers", () => ({
  ReduxProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="redux-provider">{children}</div>
  ),
  ReactQueryProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="react-query-provider">{children}</div>
  ),
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
  TransitionProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="transition-provider">{children}</div>
  ),
}));

jest.mock("@/providers/LazyMotionProvider", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="lazy-motion-provider">{children}</div>
  ),
}));

describe("RootProvider", () => {
  it("calls initPlausible once on client render", async () => {
    render(
      <RootProvider>
        <div>Child</div>
      </RootProvider>
    );

    await waitFor(() => {
      expect(initPlausible).toHaveBeenCalledTimes(1);
    });
  });
});
