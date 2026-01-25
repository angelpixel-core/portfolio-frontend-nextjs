/**
 * Article Component Tests
 * Story 4.1: Article Listing
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Use shared framer-motion mock
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock MovingImage component (using relative path as in the component)
jest.mock("../../MovingImage", () => ({
  MovingImage: ({
    title,
    img,
    link,
  }: {
    title: string;
    img: string;
    link: string;
  }) => (
    <a href={link} data-testid="moving-image">
      <span>{title}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt={title} />
    </a>
  ),
}));

// Mock useReducedMotion hook
jest.mock("@/hooks", () => ({
  useReducedMotion: () => false,
}));

import { Article } from "../index";

describe("Article Component (Story 4.1)", () => {
  const defaultProps = {
    img: "/images/articles/test-article.jpg",
    title: "Test Article Title",
    date: "March 22, 2023",
    link: "/articles/test-article",
  };

  describe("Rendering", () => {
    it("renders article as list item", () => {
      render(<Article props={defaultProps} />);

      const listItem = screen.getByRole("listitem");
      expect(listItem).toBeInTheDocument();
      expect(listItem).toHaveClass("article");
    });

    it("renders article title via MovingImage", () => {
      render(<Article props={defaultProps} />);

      expect(screen.getByText("Test Article Title")).toBeInTheDocument();
    });

    it("renders article image via MovingImage", () => {
      render(<Article props={defaultProps} />);

      const image = screen.getByRole("img");
      expect(image).toHaveAttribute("src", "/images/articles/test-article.jpg");
      expect(image).toHaveAttribute("alt", "Test Article Title");
    });

    it("renders publish date", () => {
      render(<Article props={defaultProps} />);

      const dateElement = screen.getByText("March 22, 2023");
      expect(dateElement).toBeInTheDocument();
      expect(dateElement).toHaveClass("article_publish-date");
    });

    it("passes link to MovingImage", () => {
      render(<Article props={defaultProps} />);

      const movingImageLink = screen.getByTestId("moving-image");
      expect(movingImageLink).toHaveAttribute("href", "/articles/test-article");
    });
  });

  describe("Accessibility", () => {
    it("renders as semantic list item for screen readers", () => {
      render(<Article props={defaultProps} />);

      expect(screen.getByRole("listitem")).toBeInTheDocument();
    });
  });
});
