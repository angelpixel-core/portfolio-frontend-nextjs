/**
 * ArticleListSkeleton Tests
 * Story 14.6: Articles Page Layout
 *
 * Tests for skeleton loader matching blade structure.
 */

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import ArticleListSkeleton from "../ArticleListSkeleton";

describe("ArticleListSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<ArticleListSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has articles-page container class (AC6)", () => {
    render(<ArticleListSkeleton />);
    const pageContainer = document.querySelector(".articles-page");
    expect(pageContainer).toBeInTheDocument();
  });

  it("renders hero blade section (AC6)", () => {
    render(<ArticleListSkeleton />);
    const heroSection = document.querySelector(".articles-blade--hero");
    expect(heroSection).toBeInTheDocument();
  });

  it("renders grid blade section (AC6)", () => {
    render(<ArticleListSkeleton />);
    const gridSection = document.querySelector(".articles-blade--grid");
    expect(gridSection).toBeInTheDocument();
  });

  it("renders featured article skeletons in hero blade", () => {
    render(<ArticleListSkeleton />);
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Should have featured article skeleton cards
    const featuredCards = featuredSection?.querySelectorAll(
      ".article-card--featured"
    );
    expect(featuredCards?.length).toBe(2);
  });

  it("renders grid article skeletons in grid blade", () => {
    render(<ArticleListSkeleton />);
    const grid = document.querySelector(".articles-grid");
    expect(grid).toBeInTheDocument();

    // Should have grid article skeleton cards
    const gridItems = grid?.querySelectorAll(".articles-grid__item");
    expect(gridItems?.length).toBe(3);
  });

  it("has pulse animation classes", () => {
    render(<ArticleListSkeleton />);
    const animatedElements = document.querySelectorAll(".animate-pulse");
    expect(animatedElements.length).toBeGreaterThan(0);
  });
});
