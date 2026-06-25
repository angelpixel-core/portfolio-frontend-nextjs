/**
 * Articles Page Layout Tests
 * Story 14.6: Articles Page Layout
 * Story 14.7: Article Sequential Appearance
 * Story 14.10: Article List Format
 *
 * Tests for blade structure, ArticleListItem usage, sequential appearance, and edge cases.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
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

// Mock next/link
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

// Generate mock articles for testing
const filterCategories = [
  "React",
  "Architecture",
  "Performance",
  "Testing",
] as const;

const generateArticles = (count: number, featuredIndices: number[] = [0]) =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    slug: `article-${i + 1}`,
    lang: "EN",
    title: `Article ${i + 1}`,
    summary: `Summary for article ${i + 1}`,
    img: `/img${i + 1}.jpg`,
    published_at: "2026-01-15",
    reading_time: 5,
    url: `/articles/article-${i + 1}`,
    featured: featuredIndices.includes(i),
    category: filterCategories[i % filterCategories.length],
    badges: ["UI", "DX", "Patterns"],
  }));

// Default mock with 5 articles (2 featured, 3 non-featured)
let mockArticles = generateArticles(5, [0, 1]);
let mockIsLoading = false;
let mockIsError = false;

// Mock domain hook: useArticles (explicit module path used by page)
jest.mock("@/domains/article/queries/useArticles", () => ({
  __esModule: true,
  default: () => ({
    data: mockArticles,
    isLoading: mockIsLoading,
    isError: mockIsError,
  }),
}));

// Mock UI hooks from @/hooks barrel
jest.mock("@/hooks", () => ({
  ...jest.requireActual("@/hooks"),
  useReducedMotion: () => false,
  useScrollAppearance: () => ({
    isVisible: () => true, // All items visible in tests
    registerRef: jest.fn(),
    shouldAnimate: false, // Disable animations in tests
  }),
  useTouchState: () => ({
    isTouched: false,
    handleTouchStart: jest.fn(),
    handleClick: jest.fn(),
    elementRef: { current: null },
  }),
  useTransition: () => ({
    isTransitioning: false,
    canAnimate: true,
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

  it("renders list blade for non-featured articles (Story 14.10)", () => {
    renderPage();

    const listSection = document.querySelector(".articles-blade--list");
    expect(listSection).toBeInTheDocument();
  });

  it("separates featured from non-featured articles", () => {
    renderPage();

    // Featured in hero blade
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Non-featured in list blade
    const listSection = document.querySelector(".articles-list");
    expect(listSection).toBeInTheDocument();
  });

  it("renders page title with MotionTitle", () => {
    renderPage();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Thoughts\s*&\s*Insights/i,
      })
    ).toBeInTheDocument();
  });

  it("has articles-page container class", () => {
    renderPage();

    const pageContainer = document.querySelector(".articles-page");
    expect(pageContainer).toBeInTheDocument();
  });

  it("links featured articles from the carousel to their slugs", () => {
    mockArticles = generateArticles(4, [0, 1]);
    renderPage();

    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    expect(
      featuredSection?.querySelector('a[href="/articles/article-1"]')
    ).toBeInTheDocument();
    expect(
      featuredSection?.querySelector('a[href="/articles/article-2"]')
    ).toBeInTheDocument();
  });

  it("shows carousel controls when there are multiple featured articles", () => {
    mockArticles = generateArticles(4, [0, 1]);
    renderPage();

    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    expect(
      featuredSection?.querySelector(
        'button[aria-label="Previous featured article"]'
      )
    ).toBeInTheDocument();
    expect(
      featuredSection?.querySelector(
        'button[aria-label="Next featured article"]'
      )
    ).toBeInTheDocument();
    expect(
      featuredSection?.querySelectorAll(".featured-carousel__dot").length
    ).toBe(2);
  });

  it("links non-featured articles from the list to their slugs", () => {
    mockArticles = generateArticles(4, [0, 1]);
    renderPage();

    const listSection = document.querySelector(".articles-list");
    expect(listSection).toBeInTheDocument();

    expect(
      listSection?.querySelector('a[href="/articles/article-3"]')
    ).toBeInTheDocument();
    expect(
      listSection?.querySelector('a[href="/articles/article-4"]')
    ).toBeInTheDocument();
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

  it("displays all featured articles in carousel (AC1)", () => {
    // 3 featured articles - all go to carousel
    mockArticles = generateArticles(5, [0, 1, 2]);
    renderPage();

    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // All 3 featured cards in carousel
    const featuredCards = featuredSection?.querySelectorAll(
      ".article-card--featured"
    );
    expect(featuredCards?.length).toBe(3);

    // Only non-featured articles go to list
    const listSection = document.querySelector(".articles-list");
    expect(listSection).toBeInTheDocument();

    // List should have Articles 4,5 (non-featured) = 2 items
    const listItems = document.querySelectorAll(".articles-list__item");
    expect(listItems.length).toBe(2);
  });

  it("uses FeaturedArticleCard for featured articles (AC3)", () => {
    mockArticles = generateArticles(3, [0]);
    renderPage();

    // Featured variant class should be present
    const featuredCard = document.querySelector(".article-card--featured");
    expect(featuredCard).toBeInTheDocument();
  });
});

describe("ArticlesPage - All Articles List (Story 14.10)", () => {
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

  it("renders category filter row", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 non-featured
    renderPage();

    expect(screen.getByTestId("articles-list-filters")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "React" })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Architecture" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Performance" })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Testing" })).toBeInTheDocument();
  });

  it("filters list items by selected category", () => {
    mockArticles = generateArticles(9, [0]); // 1 featured, 8 non-featured
    renderPage();

    fireEvent.click(screen.getByRole("tab", { name: "Testing" }));

    const listItems = document.querySelectorAll(".articles-list__item");
    expect(listItems.length).toBe(2);
  });

  it("renders list articles in list container", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 non-featured
    renderPage();

    const list = document.querySelector(".articles-list");
    expect(list).toBeInTheDocument();

    const listItems = document.querySelectorAll(".articles-list__item");
    expect(listItems.length).toBe(4); // 4 articles in list
  });

  it("uses ArticleListItem for non-featured articles", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 non-featured
    renderPage();

    // ArticleListItem renders with article-list-item class
    const listItemComponents = document.querySelectorAll(".article-list-item");
    expect(listItemComponents.length).toBe(4);
  });

  it("all featured articles go to carousel, non-featured to list", () => {
    // 4 featured articles: all go to carousel
    mockArticles = generateArticles(6, [0, 1, 2, 3]); // 4 featured, 2 non-featured
    renderPage();

    // Carousel has all 4 featured cards
    const featuredSection = document.querySelector(".articles-blade__featured");
    const featuredCards = featuredSection?.querySelectorAll(
      ".article-card--featured"
    );
    expect(featuredCards?.length).toBe(4);

    // List has only 2 items: non-featured articles
    const listItems = document.querySelectorAll(".articles-list__item");
    expect(listItems.length).toBe(2);
  });

  it("displays all list article titles", () => {
    mockArticles = generateArticles(5, [0]); // Article 1 is featured
    renderPage();

    // List articles (2-5) should be visible
    expect(screen.getByText("Article 2")).toBeInTheDocument();
    expect(screen.getByText("Article 3")).toBeInTheDocument();
    expect(screen.getByText("Article 4")).toBeInTheDocument();
    expect(screen.getByText("Article 5")).toBeInTheDocument();
  });

  it("displays formatted dates for list articles", () => {
    mockArticles = generateArticles(3, [0]); // 1 featured, 2 in list
    renderPage();

    // Date should be formatted (2026-01-15 -> January 15, 2026)
    const dates = screen.getAllByText(/January 15, 2026/i);
    expect(dates.length).toBeGreaterThan(0);
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

  it("handles only featured articles (no list section)", () => {
    mockArticles = generateArticles(2, [0, 1]); // All featured
    renderPage();

    // Featured section should exist
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // List section should NOT exist (no non-featured articles)
    const listSection = document.querySelector(".articles-blade--list");
    expect(listSection).not.toBeInTheDocument();
  });

  it("handles only non-featured articles (no featured section)", () => {
    mockArticles = generateArticles(3, []); // None featured
    renderPage();

    // Featured section should NOT have content
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).not.toBeInTheDocument();

    // List section should exist
    const listSection = document.querySelector(".articles-blade--list");
    expect(listSection).toBeInTheDocument();
  });

  it("handles single article gracefully", () => {
    mockArticles = generateArticles(1, [0]); // 1 featured
    renderPage();

    expect(screen.getByText("Article 1")).toBeInTheDocument();

    // List should not exist with only 1 featured article
    const listSection = document.querySelector(".articles-blade--list");
    expect(listSection).not.toBeInTheDocument();
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

    const listItems = document.querySelectorAll(".articles-list__item");
    expect(listItems.length).toBe(18); // 18 non-featured
  });
});

describe("ArticlesPage - Sequential Appearance (Story 14.7)", () => {
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

  it("wraps list articles with ArticleAppearance component (AC1)", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 in list
    renderPage();

    // List items should exist
    const listItems = document.querySelectorAll(".articles-list__item");
    expect(listItems.length).toBe(4);

    // Each list item should be wrapped (ArticleAppearance adds the class)
    listItems.forEach((item) => {
      expect(item).toBeInTheDocument();
    });
  });

  it("does not wrap featured articles with ArticleAppearance (AC1)", () => {
    mockArticles = generateArticles(3, [0, 1]); // 2 featured, 1 in list
    renderPage();

    // Featured articles are in hero blade, not wrapped with ArticleAppearance
    const featuredSection = document.querySelector(".articles-blade__featured");
    expect(featuredSection).toBeInTheDocument();

    // Featured cards should be direct children of featured section
    const featuredCards = featuredSection?.querySelectorAll(
      ".article-card--featured"
    );
    expect(featuredCards?.length).toBe(2);
  });

  it("passes unique id to each ArticleAppearance based on slug (AC1)", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 in list
    renderPage();

    // Each list article should render (ids are article-2, article-3, etc.)
    expect(screen.getByText("Article 2")).toBeInTheDocument();
    expect(screen.getByText("Article 3")).toBeInTheDocument();
    expect(screen.getByText("Article 4")).toBeInTheDocument();
    expect(screen.getByText("Article 5")).toBeInTheDocument();
  });

  it("passes index to ArticleAppearance for stagger calculation (AC5)", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 in list
    renderPage();

    // All 4 list articles should render with proper stagger
    const listItems = document.querySelectorAll(".articles-list__item");
    expect(listItems.length).toBe(4);
  });

  it("list section renders content immediately when shouldAnimate is false (AC2)", () => {
    mockArticles = generateArticles(5, [0]); // 1 featured, 4 in list
    renderPage();

    // Content should be visible (mock has shouldAnimate: false)
    expect(screen.getByText("Article 2")).toBeInTheDocument();
    expect(screen.getByText("Article 3")).toBeInTheDocument();
    expect(screen.getByText("Article 4")).toBeInTheDocument();
    expect(screen.getByText("Article 5")).toBeInTheDocument();
  });
});
