/**
 * Article JSON-LD Tests
 * Story 4.4: SEO & Indexability
 */

import { generateArticleJsonLd, renderJsonLdScript } from "../article-jsonld";
import type { Article } from "@/domains/article";

const mockArticle: Article = {
  id: 1,
  title: "Test Article Title",
  url: "/articles/test-article",
  slug: "test-article",
  reading_time: "5 min read",
  published_at: "2024-01-15",
  summary: "This is a test article summary for SEO testing.",
  content: "Full article content here.",
  img: "/images/test-article.jpg",
  featured: true,
  status: "published",
};

const siteUrl = "https://example.com";

describe("generateArticleJsonLd", () => {
  it("generates valid JSON-LD structure", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);

    expect(jsonLd["@context"]).toBe("https://schema.org");
    expect(jsonLd["@type"]).toBe("Article");
  });

  it("includes article headline from title", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);

    expect(jsonLd.headline).toBe("Test Article Title");
  });

  it("includes article description from summary", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);

    expect(jsonLd.description).toBe(
      "This is a test article summary for SEO testing."
    );
  });

  it("includes datePublished", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);

    expect(jsonLd.datePublished).toBe("2024-01-15");
  });

  it("generates absolute image URL from relative path", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);

    expect(jsonLd.image).toBe("https://example.com/images/test-article.jpg");
  });

  it("preserves absolute image URL if already absolute", () => {
    const articleWithAbsoluteImg: Article = {
      ...mockArticle,
      img: "https://cdn.example.com/image.jpg",
    };

    const jsonLd = generateArticleJsonLd(articleWithAbsoluteImg, siteUrl);

    expect(jsonLd.image).toBe("https://cdn.example.com/image.jpg");
  });

  it("includes author information", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);

    expect(jsonLd.author["@type"]).toBe("Person");
    expect(jsonLd.author.name).toBe("Angel Thunder");
  });

  it("includes publisher information", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);

    expect(jsonLd.publisher["@type"]).toBe("Organization");
    expect(jsonLd.publisher.name).toBe("Portfolio");
    expect(jsonLd.publisher.logo["@type"]).toBe("ImageObject");
    expect(jsonLd.publisher.logo.url).toBe("https://example.com/logo.png");
  });
});

describe("renderJsonLdScript", () => {
  it("returns valid JSON string", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);
    const scriptContent = renderJsonLdScript(jsonLd);

    expect(() => JSON.parse(scriptContent)).not.toThrow();
  });

  it("includes all required fields in output", () => {
    const jsonLd = generateArticleJsonLd(mockArticle, siteUrl);
    const scriptContent = renderJsonLdScript(jsonLd);
    const parsed = JSON.parse(scriptContent);

    expect(parsed["@context"]).toBeDefined();
    expect(parsed["@type"]).toBeDefined();
    expect(parsed.headline).toBeDefined();
    expect(parsed.author).toBeDefined();
    expect(parsed.publisher).toBeDefined();
  });
});
