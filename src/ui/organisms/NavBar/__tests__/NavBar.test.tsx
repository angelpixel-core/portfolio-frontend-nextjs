import React from "react";
import { render, screen } from "@testing-library/react";
import { RootProvider } from "@/providers";
import NavBar from "../index";

// Mock child organisms to isolate NavBar rendering
jest.mock("@/organisms/Menu", () => {
  const MockMenu = () => <div data-testid="mock-menu" />;
  return { __esModule: true, default: MockMenu };
});

jest.mock("@/organisms/MobileMenuOverlay", () => {
  const MockOverlay = () => null;
  return { __esModule: true, default: MockOverlay };
});

// Mock domain hooks used directly by NavBar
jest.mock("@/domains/contact-point/queries", () => ({
  useContactPoints: jest.fn().mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  }),
}));

// Mock window.matchMedia for breakpoint detection
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("NavBar", () => {
  it("renders header container with all layout zones", () => {
    render(
      <RootProvider>
        <NavBar />
      </RootProvider>
    );

    expect(screen.getByTestId("header-container")).toBeInTheDocument();
    expect(screen.getByTestId("header-logo-menu-trigger")).toBeInTheDocument();
    expect(screen.getByTestId("header-mobile-auth")).toBeInTheDocument();
    expect(screen.getByTestId("header-mobile-theme")).toBeInTheDocument();
  });
});
