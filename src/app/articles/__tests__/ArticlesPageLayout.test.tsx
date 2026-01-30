/**
 * Articles Page Layout Tests
 * Story 14.6: Articles Page Layout
 *
 * Tests for blade structure, ArticleCard usage, and edge cases.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock framer-motion
jest.mock("framer-motion", () => require("@/test-utils/framer-motion-mock"));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

// Generate mock articles for testing
const generateArticles = (count: number, featuredIndices: number[] = [0]) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    slug: `article-${i + 1}`,
    title: `Article ${i + 1}`,
    summary: `Summary for article ${i + 1}`,
    img: `/img${i + 1}.jpg`,
    published_at: "2026-01-15",
    reading_time: "5 min read",
    url: `/articles/article-${i + 1}`,
    featured: featuredIndices.includes(i),
  }));

// Default mock with 5 articles (2 featured, 3 non-featured)
let mockArticles = generateArticles(5, [0, 1]);
let mockIsLoading = false;
let mockIsError = false;

jest.mock("@/hooks", () => ({
  useArticles: () => ({
    data: mockArticles,
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
  useReducedMotion: () => false,
  useTouchState: () => ({
    isTouched: false,
    handleTouchStart: jest.fn(),
    handleClick: jest.fn(),
    elementRef: { current: null },
  }),
  useTransition: () => ({
    isTransitioning: false,
  }),
}));

import ArticlesPage from "../page";

describe("ArticlesPage - Blade Structure (AC1, AC5)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockArticles = generateArticles(5, [0, 1]);
    mockIsLoading = false;
    mockIsError = false;
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ArticlesPage />
      </QueryClientProvider>
    );

  it("renders hero blade for featured articles (AC1)", () => {
    renderPage();

    const heroSection = document.querySelector(".articles-blade--hero");
    expect(heroSection).toBeInTheDocument();
  });

  it("renders grid blade for non-featured articles (AC2)", () => {
    renderPage();

    const gridSection = document.querySelector(".articles-blade--grid");
    expect(gridSection).toBeInTheDocument();
  });

  it("separates featured from non-featured articles", () => {
    renderPage();

    // Featured in hero blade
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Non-featured in grid blade
    const gridSection = document.querySelector(".articles-grid");
    expect(gridSection).toBeInTheDocument();
  });

  it("renders page title with MotionTitle", () => {
    renderPage();

    // MotionTitle splits title into words
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Thoughts")).toBeInTheDocument();
    expect(screen.getByText("Insights")).toBeInTheDocument();
  });

  it("has articles-page container class", () => {
    renderPage();

    const pageContainer = document.querySelector(".articles-page");
    expect(pageContainer).toBeInTheDocument();
  });
});

describe("ArticlesPage - Featured Articles (AC1)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockIsLoading = false;
    mockIsError = false;
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ArticlesPage />
      </QueryClientProvider>
    );

  it("displays featured articles in hero blade", () => {
    mockArticles = generateArticles(5, [0, 1]);
    renderPage();

    // Featured articles should be in featured section
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Article 1 and 2 are featured
    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Article 2")).toBeInTheDocument();
  });

  it("limits featured articles to maximum of 2 for desktop (AC1)", () => {
    // 3 featured articles, but only 2 should appear in hero
    mockArticles = generateArticles(5, [0, 1, 2]);
    renderPage();

    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Only 2 featured cards in hero section
    const featuredCards = featuredSection?.querySelectorAll(
      ".article-card--featured"
    );
    expect(featuredCards?.length).toBe(2);

    // Article 3 (3rd featured) should be in grid, not lost
    const gridSection = document.querySelector(".articles-grid");
    expect(gridSection).toBeInTheDocument();

    // Grid should have Article 3 (extra featured) + Articles 4,5 (non-featured) = 3 items
    const gridItems = document.querySelectorAll(".articles-grid__item");
    expect(gridItems.length).toBe(3);
  });

  it("uses FeaturedArticleCard for featured articles (AC3)", () => {
    mockArticles = generateArticles(3, [0]);
    renderPage();

    // Featured variant class should be present
    const featuredCard = document.querySelector(".article-card--featured");
    expect(featuredCard).toBeInTheDocument();
  });
});

describe("ArticlesPage - Grid Articles (AC2, AC3)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockIsLoading = false;
    mockIsError = false;
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ArticlesPage />
      </QueryClientProvider>
    );

  it("renders grid articles in grid container", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 non-featured
    renderPage();

    const grid = document.querySelector(".articles-grid");
    expect(grid).toBeInTheDocument();

    const gridItems = document.querySelectorAll(".articles-grid__item");
    expect(gridItems.length).toBe(4); // 4 articles in grid
  });

  it("uses ArticleCard with auto-variant selection for grid (AC3)", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 non-featured
    renderPage();

    // ArticleCard auto-selects GridArticleCard for non-featured articles
    const gridCards = document.querySelectorAll(".article-card--grid");
    expect(gridCards.length).toBe(4);
  });

  it("extra featured articles appear as grid cards (AC3 auto-variant)", () => {
    // 4 featured articles: first 2 in hero, extra 2 should go to grid
    mockArticles = generateArticles(6, [0, 1, 2, 3]); // 4 featured, 2 non-featured
    renderPage();

    // Hero has exactly 2 featured cards
    const featuredSection = document.querySelector(".articles-blade__featured");
    const featuredCards = featuredSection?.querySelectorAll(
      ".article-card--featured"
    );
    expect(featuredCards?.length).toBe(2);

    // Grid has 4 items: 2 extra featured + 2 non-featured
    // ArticleCard auto-selects variant, so extra featured render as grid cards
    const gridItems = document.querySelectorAll(".articles-grid__item");
    expect(gridItems.length).toBe(4);
  });

  it("displays all grid article titles", () => {
    mockArticles = generateArticles(5, [0]); // Article 1 is featured
    renderPage();

    // Grid articles (2-5) should be visible
    expect(screen.getByText("Article 2")).toBeInTheDocument();
    expect(screen.getByText("Article 3")).toBeInTheDocument();
    expect(screen.getByText("Article 4")).toBeInTheDocument();
    expect(screen.getByText("Article 5")).toBeInTheDocument();
  });
});

describe("ArticlesPage - Loading and Empty States (AC6)", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ArticlesPage />
      </QueryClientProvider>
    );

  it("shows skeleton loader when loading", () => {
    mockIsLoading = true;
    mockIsError = false;
    mockArticles = [];
    renderPage();

    // Skeleton should have articles-page structure
    const skeleton = document.querySelector(".articles-page");
    expect(skeleton).toBeInTheDocument();

    // Should have animate-pulse elements
    const pulsingElements = document.querySelectorAll(".animate-pulse");
    expect(pulsingElements.length).toBeGreaterThan(0);
  });

  it("shows empty message when no articles exist", () => {
    mockIsLoading = false;
    mockIsError = false;
    mockArticles = [];
    renderPage();

    expect(screen.getByText("No articles available.")).toBeInTheDocument();
  });

  it("shows empty message on error", () => {
    mockIsLoading = false;
    mockIsError = true;
    mockArticles = [];
    renderPage();

    expect(screen.getByText("No articles available.")).toBeInTheDocument();
  });

  it("empty state has proper CSS class", () => {
    mockIsLoading = false;
    mockIsError = false;
    mockArticles = [];
    renderPage();

    const emptyMessage = document.querySelector(".articles-empty");
    expect(emptyMessage).toBeInTheDocument();
  });
});

describe("ArticlesPage - Edge Cases", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    mockIsLoading = false;
    mockIsError = false;
  });

  const renderPage = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <ArticlesPage />
      </QueryClientProvider>
    );

  it("handles only featured articles (no grid section)", () => {
    mockArticles = generateArticles(2, [0, 1]); // All featured
    renderPage();

    // Featured section should exist
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Grid section should NOT exist (no non-featured articles)
    const gridSection = document.querySelector(".articles-blade--grid");
    expect(gridSection).not.toBeInTheDocument();
  });

  it("handles only non-featured articles (no featured section)", () => {
    mockArticles = generateArticles(3, []); // None featured
    renderPage();

    // Featured section should NOT have content
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).not.toBeInTheDocument();

    // Grid section should exist
    const gridSection = document.querySelector(".articles-blade--grid");
    expect(gridSection).toBeInTheDocument();
  });

  it("handles single article gracefully", () => {
    mockArticles = generateArticles(1, [0]); // 1 featured
    renderPage();

    expect(screen.getByText("Article 1")).toBeInTheDocument();

    // Grid should not exist with only 1 featured article
    const gridSection = document.querySelector(".articles-blade--grid");
    expect(gridSection).not.toBeInTheDocument();
  });

  it("handles many articles without issues", () => {
    mockArticles = generateArticles(20, [0, 1]); // 2 featured, 18 non-featured
    renderPage();

    // Featured articles
    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Article 2")).toBeInTheDocument();

    // Non-featured articles
    expect(screen.getByText("Article 3")).toBeInTheDocument();
    expect(screen.getByText("Article 20")).toBeInTheDocument();

    const gridItems = document.querySelectorAll(".articles-grid__item");
    expect(gridItems.length).toBe(18); // 18 non-featured
  });
});
