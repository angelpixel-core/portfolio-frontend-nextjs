/**
 * Article Model Tests
 * Story 4.1: Article Listing - Sorting validation
 * Story 4.2: Article Content Reading - fetchBySlug
 * Story 6.2: Article Publishing - Draft/Future date filtering
 */

import Article from "../index";

// Mock the logger to avoid console output during tests
jest.mock("@/lib/logger", () => ({
  logger: {
    mock: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Article Model", () => {
  describe("fetchAll", () => {
    it("returns articles sorted by published_at descending (newest first)", async () => {
      const articles = await Article.fetchAll();

      // Verify we got articles
      expect(articles.length).toBeGreaterThan(0);

      // Verify sorting: each article should be newer or same date as the next
      for (let i = 0; i < articles.length - 1; i++) {
        const currentDate = new Date(articles[i].published_at).getTime();
        const nextDate = new Date(articles[i + 1].published_at).getTime();
        expect(currentDate).toBeGreaterThanOrEqual(nextDate);
      }
    });

    it("returns articles with all required fields including slug", async () => {
      const articles = await Article.fetchAll();

      articles.forEach((article) => {
        expect(article).toHaveProperty("id");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("url");
        expect(article).toHaveProperty("slug");
        expect(article).toHaveProperty("published_at");
        expect(article).toHaveProperty("summary");
        expect(article).toHaveProperty("img");
      });
    });

    it("excludes articles with status 'draft'", async () => {
      const articles = await Article.fetchAll();

      // All returned articles should have status 'published' or undefined (defaults to published)
      articles.forEach((article) => {
        expect(article.status).not.toBe("draft");
      });
    });

    it("excludes articles with future published_at dates", async () => {
      const articles = await Article.fetchAll();
      const now = new Date();

      // All returned articles should have published_at in the past or today
      articles.forEach((article) => {
        const publishedDate = new Date(article.published_at);
        expect(publishedDate.getTime()).toBeLessThanOrEqual(now.getTime());
      });
    });

    it("includes articles with past published_at and published status", async () => {
      const articles = await Article.fetchAll();

      // We should have at least one article (all mock data is published with past dates)
      expect(articles.length).toBeGreaterThan(0);

      // All mock articles have past dates and published status
      const hasPublishedArticle = articles.some(
        (article) =>
          new Date(article.published_at) <= new Date() &&
          (article.status === "published" || article.status === undefined)
      );
      expect(hasPublishedArticle).toBe(true);
    });
  });

  describe("fetchById", () => {
    it("returns article with matching id", async () => {
      const article = await Article.fetchById(16);

      expect(article).not.toBeNull();
      expect(article?.id).toBe(16);
    });

    it("returns null when id not found", async () => {
      const article = await Article.fetchById(9999);

      expect(article).toBeNull();
    });
  });

  describe("fetchBySlug", () => {
    it("returns article with matching slug", async () => {
      const article = await Article.fetchBySlug("why-portfolio-not-convert");

      expect(article).not.toBeNull();
      expect(article?.slug).toBe("why-portfolio-not-convert");
      expect(article?.title).toBe(
        "Why Most Developer Portfolios Don't Convert (And What I Did Instead)"
      );
    });

    it("returns article with content field", async () => {
      const article = await Article.fetchBySlug("why-portfolio-not-convert");

      expect(article).not.toBeNull();
      expect(article?.content).toBeDefined();
      expect(article?.content).toContain(
        "# Part 1 - Why Most Developer Portfolios Don't Convert (And What I Did Instead)"
      );
    });

    it("returns null for non-existent slug", async () => {
      const article = await Article.fetchBySlug("non-existent-article");

      expect(article).toBeNull();
    });

    it("returns article with all expected fields", async () => {
      const article = await Article.fetchBySlug("why-portfolio-not-convert");

      expect(article).not.toBeNull();
      expect(article).toHaveProperty("id");
      expect(article).toHaveProperty("title");
      expect(article).toHaveProperty("url");
      expect(article).toHaveProperty("slug");
      expect(article).toHaveProperty("reading_time");
      expect(article).toHaveProperty("published_at");
      expect(article).toHaveProperty("summary");
      expect(article).toHaveProperty("img");
      expect(article).toHaveProperty("content");
    });
  });
});
