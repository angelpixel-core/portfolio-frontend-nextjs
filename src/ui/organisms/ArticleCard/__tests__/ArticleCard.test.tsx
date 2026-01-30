import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import type { Article } from "@/domains/article/model/schema";
import { ArticleCard, FeaturedArticleCard, GridArticleCard } from "../index";
import { ArticleMeta } from "../ArticleMeta";
import { ArticleLink } from "../ArticleLink";

// Mock Next.js Link component
jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) {
    return (
      <a href={href} data-testid="next-link" {...props}>
        {children}
      </a>
    );
  };
});

// Mock FramerImage
jest.mock("@/atoms/hocs", () => ({
  FramerImage: ({
    src,
    alt,
    className,
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => (
    <img src={src} alt={alt} className={className} data-testid="framer-image" />
  ),
}));

// Mock BoxShadow
jest.mock("@/atoms/shadows", () => ({
  BoxShadow: () => <div data-testid="box-shadow" />,
}));

// Mock useTouchState hook
const mockUseTouchState = jest.fn().mockReturnValue({
  isTouched: false,
  isDisabled: false,
  handleTouchStart: jest.fn(),
  handleClick: jest.fn(),
  resetTouch: jest.fn(),
  elementRef: { current: null },
});
jest.mock("@/hooks/ui", () => ({
  useTouchState: (options: unknown) => mockUseTouchState(options),
  useReducedMotion: () => false,
}));

// Factory for creating mock articles
function createMockArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: 1,
    slug: "test-article",
    title: "Test Article Title",
    summary: "A test article summary for testing purposes",
    url: "/articles/test-article",
    reading_time: "5 min read",
    published_at: "2026-01-15",
    img: "/images/test-article.jpg",
    featured: false,
    status: "published",
    ...overrides,
  };
}

describe("ArticleCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Variant Selection (AC2)", () => {
    it("renders GridArticleCard when article is not featured", () => {
      const article = createMockArticle({ featured: false });
      render(<ArticleCard article={article} />);

      const card = document.querySelector(".article-card--grid");
      expect(card).toBeInTheDocument();
    });

    it("renders FeaturedArticleCard when article is featured", () => {
      const article = createMockArticle({ featured: true });
      render(<ArticleCard article={article} />);

      const card = document.querySelector(".article-card--featured");
      expect(card).toBeInTheDocument();
    });
  });

  describe("GridArticleCard (AC1)", () => {
    it("renders article title", () => {
      const article = createMockArticle({ title: "My Awesome Article" });
      render(<GridArticleCard article={article} />);

      expect(screen.getByText("My Awesome Article")).toBeInTheDocument();
    });

    it("renders article summary", () => {
      const article = createMockArticle({
        summary: "This is the article summary",
      });
      render(<GridArticleCard article={article} />);

      expect(
        screen.getByText("This is the article summary")
      ).toBeInTheDocument();
    });

    it("renders publication date", () => {
      const article = createMockArticle({ published_at: "2026-01-15" });
      render(<GridArticleCard article={article} />);

      // Date may show as 14 or 15 depending on timezone
      const dateElement = document.querySelector(".article-card__date");
      expect(dateElement).toBeInTheDocument();
      expect(dateElement?.textContent).toMatch(/January 1[45], 2026/);
    });

    it("renders reading time", () => {
      const article = createMockArticle({ reading_time: "8 min read" });
      render(<GridArticleCard article={article} />);

      expect(screen.getByText("8 min read")).toBeInTheDocument();
    });

    it("renders article image", () => {
      const article = createMockArticle({ img: "/images/my-image.jpg" });
      render(<GridArticleCard article={article} />);

      const image = screen.getByTestId("framer-image");
      expect(image).toHaveAttribute("src", "/images/my-image.jpg");
    });

    it("uses semantic HTML article element", () => {
      const article = createMockArticle();
      render(<GridArticleCard article={article} />);

      const articleElement = document.querySelector("article");
      expect(articleElement).toBeInTheDocument();
      expect(articleElement).toHaveClass("article-card");
    });

    it("applies custom className", () => {
      const article = createMockArticle();
      render(<GridArticleCard article={article} className="custom-class" />);

      const card = document.querySelector(".article-card");
      expect(card).toHaveClass("custom-class");
    });
  });

  describe("FeaturedArticleCard (AC1)", () => {
    it("renders article title with featured styling", () => {
      const article = createMockArticle({
        featured: true,
        title: "Featured Article",
      });
      render(<FeaturedArticleCard article={article} />);

      const title = screen.getByText("Featured Article");
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("article-card__title--featured");
    });

    it("renders article summary", () => {
      const article = createMockArticle({
        featured: true,
        summary: "Featured summary",
      });
      render(<FeaturedArticleCard article={article} />);

      expect(screen.getByText("Featured summary")).toBeInTheDocument();
    });

    it("renders publication date prominently", () => {
      const article = createMockArticle({
        featured: true,
        published_at: "2026-02-20",
      });
      render(<FeaturedArticleCard article={article} />);

      // Date may vary by timezone
      const dateElement = document.querySelector(".article-card__date");
      expect(dateElement).toBeInTheDocument();
      expect(dateElement?.textContent).toMatch(/February (19|20), 2026/);
    });

    it("uses semantic HTML article element", () => {
      const article = createMockArticle({ featured: true });
      render(<FeaturedArticleCard article={article} />);

      const articleElement = document.querySelector("article");
      expect(articleElement).toBeInTheDocument();
      expect(articleElement).toHaveClass("article-card--featured");
    });
  });

  describe("Touch State Integration (AC5)", () => {
    it("calls useTouchState with correct id for grid variant", () => {
      const article = createMockArticle({ slug: "my-article" });
      render(<GridArticleCard article={article} />);

      expect(mockUseTouchState).toHaveBeenCalledWith({
        id: "grid-article-my-article",
      });
    });

    it("calls useTouchState with correct id for featured variant", () => {
      const article = createMockArticle({
        featured: true,
        slug: "featured-article",
      });
      render(<FeaturedArticleCard article={article} />);

      expect(mockUseTouchState).toHaveBeenCalledWith({
        id: "featured-article-featured-article",
      });
    });

    it("applies touched class when isTouched is true", () => {
      mockUseTouchState.mockReturnValueOnce({
        isTouched: true,
        isDisabled: false,
        handleTouchStart: jest.fn(),
        handleClick: jest.fn(),
        resetTouch: jest.fn(),
        elementRef: { current: null },
      });

      const article = createMockArticle();
      render(<GridArticleCard article={article} />);

      const card = document.querySelector(".article-card");
      expect(card).toHaveClass("article-card--touched");
    });

    it("attaches touch handlers to article element", () => {
      const mockHandleTouchStart = jest.fn();
      const mockHandleClick = jest.fn();

      mockUseTouchState.mockReturnValueOnce({
        isTouched: false,
        isDisabled: false,
        handleTouchStart: mockHandleTouchStart,
        handleClick: mockHandleClick,
        resetTouch: jest.fn(),
        elementRef: { current: null },
      });

      const article = createMockArticle();
      render(<GridArticleCard article={article} />);

      const card = document.querySelector(".article-card") as HTMLElement;

      // Simulate touch start
      fireEvent.touchStart(card);
      expect(mockHandleTouchStart).toHaveBeenCalled();

      // Simulate click
      fireEvent.click(card);
      expect(mockHandleClick).toHaveBeenCalled();
    });
  });

  describe("Reduced Motion Support (AC5)", () => {
    it("integrates with useReducedMotion hook", () => {
      // This test verifies that the component integrates with useReducedMotion
      // The actual reduced motion behavior is handled by CSS media queries
      const article = createMockArticle();
      render(<GridArticleCard article={article} />);

      // Component renders without errors with reduced motion mock
      expect(document.querySelector(".article-card")).toBeInTheDocument();
    });

    it("disables touch state when reduced motion is enabled", () => {
      // When reduced motion is enabled, useTouchState returns isDisabled: true
      mockUseTouchState.mockReturnValueOnce({
        isTouched: false,
        isDisabled: true, // Reduced motion enabled
        handleTouchStart: jest.fn(),
        handleClick: jest.fn(),
        resetTouch: jest.fn(),
        elementRef: { current: null },
      });

      const article = createMockArticle();
      render(<GridArticleCard article={article} />);

      // Component should render normally (CSS handles reduced motion visibility)
      const card = document.querySelector(".article-card");
      expect(card).toBeInTheDocument();
      // Touch state should not be applied when disabled
      expect(card).not.toHaveClass("article-card--touched");
    });
  });
});

describe("ArticleMeta", () => {
  it("formats date correctly", () => {
    render(<ArticleMeta publishedAt="2026-03-10" readingTime="10 min read" />);

    // Date may vary by timezone
    const dateElement = document.querySelector(".article-card__date");
    expect(dateElement).toBeInTheDocument();
    expect(dateElement?.textContent).toMatch(/March (9|10), 2026/);
  });

  it("displays reading time", () => {
    render(<ArticleMeta publishedAt="2026-01-01" readingTime="15 min read" />);

    expect(screen.getByText("15 min read")).toBeInTheDocument();
  });

  it("includes proper datetime attribute for accessibility", () => {
    render(<ArticleMeta publishedAt="2026-05-25" readingTime="5 min read" />);

    const timeElement = document.querySelector("time");
    expect(timeElement).toHaveAttribute("datetime", "2026-05-25");
  });

  it("applies custom className", () => {
    render(
      <ArticleMeta
        publishedAt="2026-01-01"
        readingTime="5 min read"
        className="custom-meta"
      />
    );

    const meta = document.querySelector(".article-card__meta");
    expect(meta).toHaveClass("custom-meta");
  });

  it("handles empty date string gracefully", () => {
    render(<ArticleMeta publishedAt="" readingTime="5 min read" />);

    const dateElement = document.querySelector(".article-card__date");
    expect(dateElement).toBeInTheDocument();
    expect(dateElement?.textContent).toBe("Date unavailable");
  });

  it("handles invalid date string gracefully", () => {
    render(
      <ArticleMeta publishedAt="not-a-valid-date" readingTime="5 min read" />
    );

    const dateElement = document.querySelector(".article-card__date");
    expect(dateElement).toBeInTheDocument();
    expect(dateElement?.textContent).toBe("Date unavailable");
  });
});

describe("ArticleLink", () => {
  describe("Internal Links (AC3)", () => {
    it("renders Next.js Link for internal URLs", () => {
      render(
        <ArticleLink url="/articles/my-article" slug="my-article">
          Read More
        </ArticleLink>
      );

      const link = screen.getByTestId("next-link");
      expect(link).toHaveAttribute("href", "/articles/my-article");
    });

    it("does not add target or rel for internal links", () => {
      render(
        <ArticleLink url="/articles/my-article" slug="my-article">
          Read More
        </ArticleLink>
      );

      const link = screen.getByTestId("next-link");
      expect(link).not.toHaveAttribute("target");
      expect(link).not.toHaveAttribute("rel");
    });

    it("uses slug to construct internal URL when url is relative", () => {
      render(
        <ArticleLink url="/test" slug="my-slug">
          Read More
        </ArticleLink>
      );

      // Non-external URLs always use /articles/{slug} pattern for routing
      const link = screen.getByTestId("next-link");
      expect(link).toHaveAttribute("href", "/articles/my-slug");
    });
  });

  describe("External Links (AC3)", () => {
    it("renders regular anchor for external URLs", () => {
      render(
        <ArticleLink url="https://dev.to/my-article" slug="my-article">
          Read on Dev.to
        </ArticleLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "https://dev.to/my-article");
    });

    it("opens external links in new tab", () => {
      render(
        <ArticleLink url="https://medium.com/article" slug="article">
          Read on Medium
        </ArticleLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("adds security attributes for external links", () => {
      render(
        <ArticleLink url="https://example.com/article" slug="article">
          External Article
        </ArticleLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("handles http:// URLs as external", () => {
      render(
        <ArticleLink url="http://old-site.com/article" slug="article">
          Old Article
        </ArticleLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Accessibility", () => {
    it("applies aria-label when provided", () => {
      render(
        <ArticleLink
          url="/articles/test"
          slug="test"
          ariaLabel="Read article: Test Article"
        >
          Read More
        </ArticleLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-label", "Read article: Test Article");
    });

    it("applies custom className", () => {
      render(
        <ArticleLink url="/articles/test" slug="test" className="custom-link">
          Read More
        </ArticleLink>
      );

      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-link");
    });
  });
});

describe("44x44px Touch Target Compliance (AC5, AC6)", () => {
  it("title links have proper CSS classes for touch targets", () => {
    const article = createMockArticle();
    render(<GridArticleCard article={article} />);

    const titleLink = document.querySelector(".article-card__title-link");
    expect(titleLink).toBeInTheDocument();
    // The 44x44px is enforced via CSS media query (hover: none)
    // This test verifies the class exists for CSS to target
  });

  it("image links have proper CSS classes for touch targets", () => {
    const article = createMockArticle();
    render(<GridArticleCard article={article} />);

    const imageLink = document.querySelector(".article-card__image-link");
    expect(imageLink).toBeInTheDocument();
  });

  it("featured variant has proper touch target classes", () => {
    const article = createMockArticle({ featured: true });
    render(<FeaturedArticleCard article={article} />);

    const imageLink = document.querySelector(
      ".article-card__image-link--featured"
    );
    expect(imageLink).toBeInTheDocument();
  });
});
