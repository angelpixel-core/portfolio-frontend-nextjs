import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import TransitionLink from "../index";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/",
}));

// Mock useTransition hook
const mockStartTransition = jest.fn();
type TransitionPhase = "idle" | "entering" | "covering" | "exiting";
const mockUseTransition = jest.fn(() => ({
  isTransitioning: false,
  phase: "idle" as TransitionPhase,
  progress: 0,
  targetHref: null as string | null,
  startTransition: mockStartTransition,
  shouldReduceMotion: false,
}));

jest.mock("@/hooks/ui/useTransition", () => ({
  useTransition: () => mockUseTransition(),
}));

describe("TransitionLink", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("renders children correctly", () => {
      render(<TransitionLink href="/about">About Page</TransitionLink>);

      expect(screen.getByText("About Page")).toBeInTheDocument();
    });

    it("renders as a link with correct href", () => {
      render(<TransitionLink href="/about">About</TransitionLink>);

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/about");
    });

    it("passes through additional props", () => {
      render(
        <TransitionLink
          href="/about"
          className="custom-class"
          data-testid="test-link"
        >
          About
        </TransitionLink>
      );

      const link = screen.getByTestId("test-link");
      expect(link).toHaveClass("custom-class");
    });
  });

  describe("Internal navigation", () => {
    it("calls startTransition on click for internal links", () => {
      render(<TransitionLink href="/about">About</TransitionLink>);

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(mockStartTransition).toHaveBeenCalledWith("/about");
    });

    it("prevents default navigation for internal links", () => {
      render(<TransitionLink href="/about">About</TransitionLink>);

      const link = screen.getByRole("link");
      fireEvent.click(link);

      // startTransition should be called (which handles the navigation)
      expect(mockStartTransition).toHaveBeenCalled();
    });

    it("calls optional onClick handler for internal links", () => {
      const handleClick = jest.fn();
      render(
        <TransitionLink href="/about" onClick={handleClick}>
          About
        </TransitionLink>
      );

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(handleClick).toHaveBeenCalled();
      expect(mockStartTransition).toHaveBeenCalledWith("/about");
    });
  });

  describe("External URLs", () => {
    it("does NOT call startTransition for https URLs", () => {
      render(
        <TransitionLink href="https://example.com">External</TransitionLink>
      );

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(mockStartTransition).not.toHaveBeenCalled();
    });

    it("does NOT call startTransition for http URLs", () => {
      render(
        <TransitionLink href="http://example.com">External</TransitionLink>
      );

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(mockStartTransition).not.toHaveBeenCalled();
    });

    it("does NOT call startTransition for protocol-relative URLs", () => {
      render(<TransitionLink href="//example.com">External</TransitionLink>);

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(mockStartTransition).not.toHaveBeenCalled();
    });
  });

  describe("Same page navigation", () => {
    it("does NOT call startTransition for same page (root)", () => {
      // Pathname is "/" from mock
      render(<TransitionLink href="/">Home</TransitionLink>);

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(mockStartTransition).not.toHaveBeenCalled();
    });
  });

  describe("Modifier keys (new tab)", () => {
    it("does NOT call startTransition on cmd+click (Mac)", () => {
      render(<TransitionLink href="/about">About</TransitionLink>);

      const link = screen.getByRole("link");
      fireEvent.click(link, { metaKey: true });

      expect(mockStartTransition).not.toHaveBeenCalled();
    });

    it("does NOT call startTransition on ctrl+click (Windows)", () => {
      render(<TransitionLink href="/about">About</TransitionLink>);

      const link = screen.getByRole("link");
      fireEvent.click(link, { ctrlKey: true });

      expect(mockStartTransition).not.toHaveBeenCalled();
    });

    it("does NOT call startTransition on middle click", () => {
      render(<TransitionLink href="/about">About</TransitionLink>);

      const link = screen.getByRole("link");
      fireEvent.click(link, { button: 1 });

      expect(mockStartTransition).not.toHaveBeenCalled();
    });
  });

  describe("Already transitioning", () => {
    it("ignores click when already transitioning", () => {
      mockUseTransition.mockReturnValueOnce({
        isTransitioning: true,
        phase: "entering" as const,
        progress: 50,
        targetHref: "/other",
        startTransition: mockStartTransition,
        shouldReduceMotion: false,
      });

      render(<TransitionLink href="/about">About</TransitionLink>);

      const link = screen.getByRole("link");
      fireEvent.click(link);

      expect(mockStartTransition).not.toHaveBeenCalled();
    });
  });
});
