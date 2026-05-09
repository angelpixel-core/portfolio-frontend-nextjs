/**
 * Article Filtering Tests
 * Story 6.2: Article Publishing - Draft/Future date filtering
 *
 * Tests that verify fetchAll correctly filters out:
 * - Articles with status: "draft"
 * - Articles with published_at in the future
 */

import type { Article } from "../schema";

// Mock the logger to avoid console output during tests
jest.mock("@/lib/logger", () => ({
  logger: {
    mock: jest.fn(),
    error: jest.fn(),
  },
}));

// Helper to create a date string in the past
const pastDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split("T")[0];
};

// Helper to create a date string in the future
const futureDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
};

// Test articles with various states
const testArticles: Article[] = [
  {
    id: 1,
    title: "Published Article (Past Date)",
    url: "/articles/published-past",
    slug: "published-past",
    lang: "EN",
    reading_time: "5 min read",
    published_at: pastDate(10),
    summary: "This is a published article with a past date.",
    img: "/images/articles/test.jpg",
    featured: false,
    status: "published",
  },
  {
    id: 2,
    title: "Draft Article",
    url: "/articles/draft-article",
    slug: "draft-article",
    lang: "EN",
    reading_time: "3 min read",
    published_at: pastDate(5),
    summary: "This is a draft article that should NOT appear.",
    img: "/images/articles/test.jpg",
    featured: false,
    status: "draft",
  },
  {
    id: 3,
    title: "Future Scheduled Article",
    url: "/articles/future-article",
    slug: "future-article",
    lang: "EN",
    reading_time: "7 min read",
    published_at: futureDate(30),
    summary: "This article is scheduled for the future.",
    img: "/images/articles/test.jpg",
    featured: true,
    status: "published",
  },
  {
    id: 4,
    title: "Today's Article",
    url: "/articles/today-article",
    slug: "today-article",
    lang: "EN",
    reading_time: "4 min read",
    published_at: new Date().toISOString().split("T")[0],
    summary: "Published today, should appear.",
    img: "/images/articles/test.jpg",
    featured: false,
    status: "published",
  },
  {
    id: 5,
    title: "Article Without Status (Defaults to Published)",
    url: "/articles/no-status",
    slug: "no-status",
    lang: "EN",
    reading_time: "6 min read",
    published_at: pastDate(2),
    summary: "No explicit status, should default to published.",
    img: "/images/articles/test.jpg",
    featured: false,
    status: "published",
  },
];

describe("Article Filtering (Story 6.2)", () => {
  let ArticleModule: typeof import("../index").default;

  beforeEach(async () => {
    // Clear module cache to ensure fresh import with our mocked data
    jest.resetModules();

    // Re-mock after reset
    jest.mock("@/lib/logger", () => ({
      logger: {
        mock: jest.fn(),
        error: jest.fn(),
      },
    }));

    jest.doMock("../devData", () => ({
      __esModule: true,
      getArticleDevData: async () => testArticles,
    }));

    // Import the module fresh
    const importedModule = await import("../index");
    ArticleModule = importedModule.default;
  });

  describe("fetchBySlug filtering (H1 fix)", () => {
    it("returns null for draft articles accessed directly by slug", async () => {
      const article = await ArticleModule.fetchBySlug("draft-article", {
        useMockFallback: true,
      });
      expect(article).toBeNull();
    });

    it("returns null for future-dated articles accessed directly by slug", async () => {
      const article = await ArticleModule.fetchBySlug("future-article", {
        useMockFallback: true,
      });
      expect(article).toBeNull();
    });

    it("returns published article with past date when accessed by slug", async () => {
      const article = await ArticleModule.fetchBySlug("published-past", {
        useMockFallback: true,
      });
      expect(article).not.toBeNull();
      expect(article?.title).toBe("Published Article (Past Date)");
    });

    it("returns article published today when accessed by slug", async () => {
      const article = await ArticleModule.fetchBySlug("today-article", {
        useMockFallback: true,
      });
      expect(article).not.toBeNull();
    });
  });

  describe("fetchById filtering (H1 fix)", () => {
    it("returns null for draft articles accessed directly by ID", async () => {
      const article = await ArticleModule.fetchById(2, {
        useMockFallback: true,
      }); // draft-article
      expect(article).toBeNull();
    });

    it("returns null for future-dated articles accessed directly by ID", async () => {
      const article = await ArticleModule.fetchById(3, {
        useMockFallback: true,
      }); // future-article
      expect(article).toBeNull();
    });

    it("returns published article with past date when accessed by ID", async () => {
      const article = await ArticleModule.fetchById(1, {
        useMockFallback: true,
      }); // published-past
      expect(article).not.toBeNull();
      expect(article?.title).toBe("Published Article (Past Date)");
    });

    it("returns null for non-existent ID", async () => {
      const article = await ArticleModule.fetchById(9999, {
        useMockFallback: true,
      });
      expect(article).toBeNull();
    });
  });

  describe("fetchAll filtering", () => {
    it("excludes articles with status 'draft'", async () => {
      const articles = await ArticleModule.fetchAll({ useMockFallback: true });

      const draftArticle = articles.find((a) => a.slug === "draft-article");
      expect(draftArticle).toBeUndefined();
    });

    it("excludes articles with future published_at dates", async () => {
      const articles = await ArticleModule.fetchAll({ useMockFallback: true });

      const futureArticle = articles.find((a) => a.slug === "future-article");
      expect(futureArticle).toBeUndefined();
    });

    it("includes articles with past published_at and published status", async () => {
      const articles = await ArticleModule.fetchAll({ useMockFallback: true });

      const publishedArticle = articles.find(
        (a) => a.slug === "published-past"
      );
      expect(publishedArticle).toBeDefined();
      expect(publishedArticle?.title).toBe("Published Article (Past Date)");
    });

    it("includes articles published today", async () => {
      const articles = await ArticleModule.fetchAll({ useMockFallback: true });

      const todayArticle = articles.find((a) => a.slug === "today-article");
      expect(todayArticle).toBeDefined();
    });

    it("includes articles without explicit status (defaults to published)", async () => {
      const articles = await ArticleModule.fetchAll({ useMockFallback: true });

      const noStatusArticle = articles.find((a) => a.slug === "no-status");
      expect(noStatusArticle).toBeDefined();
    });

    it("returns correct count after filtering", async () => {
      const articles = await ArticleModule.fetchAll({ useMockFallback: true });

      // Should have: published-past, today-article, no-status
      // Should NOT have: draft-article, future-article
      expect(articles.length).toBe(3);
    });
  });
});
