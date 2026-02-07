/**
 * ArticleListSkeleton Tests
 * Story 14.6: Articles Page Layout
 *
 * Tests for skeleton loader matching blade structure.
 */

import { render, screen } from "@testing-library/react";
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

  it("has articles-skeleton testid for loading detection", () => {
    render(<ArticleListSkeleton />);
    expect(screen.getByTestId("articles-skeleton")).toBeInTheDocument();
  });

  it("renders hero blade section (AC6)", () => {
    render(<ArticleListSkeleton />);
    const heroSection = document.querySelector(".articles-blade--hero");
    expect(heroSection).toBeInTheDocument();
  });

  it("renders list blade section (AC6)", () => {
    render(<ArticleListSkeleton />);
    // Note: Changed from --grid to --list in component refactoring
    const listSection = document.querySelector(".articles-blade--list");
    expect(listSection).toBeInTheDocument();
  });

  it("renders featured article skeleton in hero blade", () => {
    render(<ArticleListSkeleton />);
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Should have featured article skeleton card (1 in carousel)
    const featuredCards = featuredSection?.querySelectorAll(
      ".article-card--featured"
    );
    expect(featuredCards?.length).toBe(1);
  });

  it("renders featured carousel structure", () => {
    render(<ArticleListSkeleton />);
    expect(document.querySelector(".featured-carousel")).toBeInTheDocument();
    expect(
      document.querySelector(".featured-carousel__viewport")
    ).toBeInTheDocument();
    expect(
      document.querySelector(".featured-carousel__dots")
    ).toBeInTheDocument();
  });

  it("renders article list skeletons in list blade", () => {
    render(<ArticleListSkeleton />);
    const list = document.querySelector(".articles-list");
    expect(list).toBeInTheDocument();

    // Should have 3 list item skeletons
    const listItems = list?.querySelectorAll(".articles-list__item");
    expect(listItems?.length).toBe(3);
  });

  it("has pulse animation classes", () => {
    render(<ArticleListSkeleton />);
    const animatedElements = document.querySelectorAll(".animate-pulse");
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it("marks skeleton content as aria-hidden", () => {
    render(<ArticleListSkeleton />);
    const hiddenArticles = document.querySelectorAll(
      'article[aria-hidden="true"]'
    );
    // Should have 1 featured card + 3 list items = 4 hidden articles
    expect(hiddenArticles.length).toBe(4);
  });
});
