/**
 * Article Data Validation Test
 *
 * This test validates the actual article mock data against the schema.
 * Run with: npm run validate:articles
 *
 * @see docs/content-management.md
 * @see Story 6.2: Article Publishing
 */

import { ArticlesSchema } from "../schema";
import articlesMock from "../mock";

describe("Article Data Validation", () => {
  it("validates all articles in mock data", () => {
    expect(() => ArticlesSchema.parse(articlesMock)).not.toThrow();
  });

  it("has at least one article", () => {
    expect(articlesMock.length).toBeGreaterThan(0);
  });

  it("has unique IDs for all articles", () => {
    const ids = articlesMock.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it("has unique slugs for all articles", () => {
    const slugs = articlesMock.map((a) => a.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it("has at least one featured article", () => {
    const featuredArticles = articlesMock.filter((a) => a.featured);
    expect(featuredArticles.length).toBeGreaterThan(0);
  });

  it("all articles have valid image paths", () => {
    articlesMock.forEach((article) => {
      expect(article.img).toMatch(/^\/images\/articles\//);
    });
  });

  it("all articles have valid published_at dates", () => {
    articlesMock.forEach((article) => {
      const date = new Date(article.published_at);
      expect(date.toString()).not.toBe("Invalid Date");
    });
  });

  it("all articles have status published or undefined", () => {
    // Ensure no accidental drafts in production mock data
    articlesMock.forEach((article) => {
      if (article.status !== undefined) {
        expect(article.status).toBe("published");
      }
    });
  });

  // Display article summary for visual confirmation
  it("displays article summary", () => {
    console.log("\n📰 Article Data Summary:");
    console.log("========================");
    articlesMock.forEach((article, index) => {
      const featured = article.featured ? "⭐" : "  ";
      const status =
        article.status === "draft"
          ? "📝"
          : article.status === "published"
            ? "✅"
            : "✅";
      console.log(
        `  ${index + 1}. ${featured} ${status} ${article.title} (${article.reading_time})`
      );
    });
    console.log("\nLegend: ⭐ Featured | ✅ Published | 📝 Draft\n");
    expect(true).toBe(true); // Always pass - this is for output only
  });
});
