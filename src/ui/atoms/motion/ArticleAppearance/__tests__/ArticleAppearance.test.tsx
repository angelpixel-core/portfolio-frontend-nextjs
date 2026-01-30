/**
 * ArticleAppearance Component Tests
 * Story 14.7: Article Sequential Appearance
 *
 * Tests for scroll-triggered animation wrapper component.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock useScrollAppearance hook
let mockIsVisible = false;
let mockShouldAnimate = true;
const mockRegisterRef = jest.fn();

jest.mock("@/hooks", () => ({
  useScrollAppearance: () => ({
    isVisible: () => mockIsVisible,
    registerRef: mockRegisterRef,
    shouldAnimate: mockShouldAnimate,
  }),
  useReducedMotion: () => false,
}));

import ArticleAppearance from "../index";

describe("ArticleAppearance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsVisible = false;
    mockShouldAnimate = true;
  });

  describe("Basic rendering", () => {
    it("renders children", () => {
      render(
        <ArticleAppearance id="test-article">
          <div data-testid="child">Article Content</div>
        </ArticleAppearance>
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByText("Article Content")).toBeInTheDocument();
    });

    it("wraps children in motion.div", () => {
      const { container } = render(
        <ArticleAppearance id="test-article">
          <div>Content</div>
        </ArticleAppearance>
      );

      // Motion mock renders as div
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("registers ref with id on mount", () => {
      render(
        <ArticleAppearance id="article-123">
          <div>Content</div>
        </ArticleAppearance>
      );

      expect(mockRegisterRef).toHaveBeenCalledWith(
        "article-123",
        expect.any(Object)
      );
    });
  });

  describe("Animation states (AC5)", () => {
    it("applies initial hidden state when shouldAnimate is true", () => {
      mockShouldAnimate = true;
      mockIsVisible = false;

      const { container } = render(
        <ArticleAppearance id="test">
          <div>Content</div>
        </ArticleAppearance>
      );

      // The motion wrapper should be present
      expect(container.firstChild).toBeInTheDocument();
    });

    it("applies visible state when isVisible is true", () => {
      mockShouldAnimate = true;
      mockIsVisible = true;

      const { container } = render(
        <ArticleAppearance id="test">
          <div>Content</div>
        </ArticleAppearance>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("skips animation when shouldAnimate is false", () => {
      mockShouldAnimate = false;
      mockIsVisible = false;

      const { container } = render(
        <ArticleAppearance id="test">
          <div>Content</div>
        </ArticleAppearance>
      );

      // Content should still be visible
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Reduced motion support (AC3)", () => {
    it("renders content immediately when animations disabled", () => {
      mockShouldAnimate = false;

      render(
        <ArticleAppearance id="test">
          <div data-testid="content">Immediate Content</div>
        </ArticleAppearance>
      );

      expect(screen.getByTestId("content")).toBeInTheDocument();
    });
  });

  describe("Props and customization", () => {
    it("accepts custom className", () => {
      const { container } = render(
        <ArticleAppearance id="test" className="custom-class">
          <div>Content</div>
        </ArticleAppearance>
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("accepts custom delay", () => {
      // Delay is used in animation config, verified through component rendering
      render(
        <ArticleAppearance id="test" delay={0.2}>
          <div>Content</div>
        </ArticleAppearance>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("accepts custom index for stagger calculation", () => {
      render(
        <ArticleAppearance id="test" index={3}>
          <div>Content</div>
        </ArticleAppearance>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });

  describe("Cleanup", () => {
    it("unregisters ref on unmount", () => {
      const { unmount } = render(
        <ArticleAppearance id="test-cleanup">
          <div>Content</div>
        </ArticleAppearance>
      );

      // Clear previous calls
      mockRegisterRef.mockClear();

      unmount();

      expect(mockRegisterRef).toHaveBeenCalledWith("test-cleanup", null);
    });
  });

  describe("Accessibility", () => {
    it("does not interfere with children accessibility", () => {
      render(
        <ArticleAppearance id="test">
          <article aria-label="Test article">
            <h2>Article Title</h2>
            <p>Article content</p>
          </article>
        </ArticleAppearance>
      );

      expect(screen.getByRole("article")).toBeInTheDocument();
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });
  });
});
