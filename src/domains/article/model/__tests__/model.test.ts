/**
 * Article Model Tests
 * Story 4.1: Article Listing - Sorting validation
 * Story 4.2: Article Content Reading - fetchBySlug
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
  });

  describe("fetchById", () => {
    it("returns article with matching id", async () => {
      const article = await Article.fetchById(1);

      expect(article).toBeDefined();
      expect(article.id).toBe(1);
    });

    it("falls back to first article when id not found", async () => {
      const article = await Article.fetchById(9999);

      expect(article).toBeDefined();
      expect(article.id).toBe(1); // First mock article
    });
  });

  describe("fetchBySlug", () => {
    it("returns article with matching slug", async () => {
      const article = await Article.fetchBySlug("react-pagination");

      expect(article).not.toBeNull();
      expect(article?.slug).toBe("react-pagination");
      expect(article?.title).toBe(
        "Build A Custom Pagination Component In ReactJS From Scratch"
      );
    });

    it("returns article with content field", async () => {
      const article = await Article.fetchBySlug("react-pagination");

      expect(article).not.toBeNull();
      expect(article?.content).toBeDefined();
      expect(article?.content).toContain("# Build A Custom Pagination");
    });

    it("returns null for non-existent slug", async () => {
      const article = await Article.fetchBySlug("non-existent-article");

      expect(article).toBeNull();
    });

    it("returns article with all expected fields", async () => {
      const article = await Article.fetchBySlug("loading-screens");

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
