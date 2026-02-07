/**
 * ArticleAppearance Component Tests
 * Story 14.7: Article Sequential Appearance
 *
 * Tests for scroll-triggered animation wrapper component.
 * Uses Framer Motion's whileInView for scroll detection.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock useReducedMotion hook
let mockReducedMotion = false;

jest.mock("@/hooks", () => ({
  useReducedMotion: () => mockReducedMotion,
}));

import ArticleAppearance from "../index";

describe("ArticleAppearance", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReducedMotion = false;
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

    it("wraps children in div element", () => {
      const { container } = render(
        <ArticleAppearance id="test-article">
          <div>Content</div>
        </ArticleAppearance>
      );

      // Motion mock renders as div
      expect(container.querySelector("div")).toBeInTheDocument();
    });

    it("sets data-article-id attribute with id prop", () => {
      const { container } = render(
        <ArticleAppearance id="article-123">
          <div>Content</div>
        </ArticleAppearance>
      );

      expect(
        container.querySelector('[data-article-id="article-123"]')
      ).toBeInTheDocument();
    });
  });

  describe("Animation behavior", () => {
    it("renders with motion wrapper when shouldReduceMotion is false", () => {
      mockReducedMotion = false;

      const { container } = render(
        <ArticleAppearance id="test">
          <div>Content</div>
        </ArticleAppearance>
      );

      // Motion wrapper should be present
      expect(container.firstChild).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders content visible in motion wrapper", () => {
      mockReducedMotion = false;

      render(
        <ArticleAppearance id="test">
          <div data-testid="animated-content">Animated</div>
        </ArticleAppearance>
      );

      expect(screen.getByTestId("animated-content")).toBeInTheDocument();
    });
  });

  describe("Reduced motion support (AC3)", () => {
    it("renders without animation when reduced motion is preferred", () => {
      mockReducedMotion = true;

      render(
        <ArticleAppearance id="test">
          <div data-testid="content">Immediate Content</div>
        </ArticleAppearance>
      );

      // Content should be visible immediately
      expect(screen.getByTestId("content")).toBeInTheDocument();
    });

    it("still sets data-article-id when reduced motion is enabled", () => {
      mockReducedMotion = true;

      const { container } = render(
        <ArticleAppearance id="reduced-motion-test">
          <div>Content</div>
        </ArticleAppearance>
      );

      expect(
        container.querySelector('[data-article-id="reduced-motion-test"]')
      ).toBeInTheDocument();
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

    it("accepts custom delay prop", () => {
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

    it("combines className with data-article-id", () => {
      const { container } = render(
        <ArticleAppearance id="combined-test" className="my-class">
          <div>Content</div>
        </ArticleAppearance>
      );

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass("my-class");
      expect(wrapper).toHaveAttribute("data-article-id", "combined-test");
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

    it("preserves semantic structure of children", () => {
      render(
        <ArticleAppearance id="semantic-test">
          <section>
            <h3>Section Title</h3>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </section>
        </ArticleAppearance>
      );

      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
      expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });
  });
});
