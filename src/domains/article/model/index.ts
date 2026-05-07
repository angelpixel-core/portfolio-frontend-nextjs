import { eq } from "drizzle-orm";
import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import { memoryStore } from "../../../db/memory-store";
import { isMemoryDriver } from "../../../db/runtime";
import mockData from "./mock";
import {
  ArticleSchema,
  ArticlesSchema,
  type Article as ArticleType,
  type Articles,
} from "./schema";

const ENDPOINT = "articles";

interface FetchOptions {
  useMockFallback?: boolean;
}

/**
 * Check if a single article should be visible:
 * - Not a draft (status !== "draft")
 * - published_at is not in the future
 *
 * @see Story 6.2: Article Publishing
 */
const isArticlePublished = (article: ArticleType): boolean => {
  const now = new Date();
  // Set to end of day to include articles published today
  now.setHours(23, 59, 59, 999);

  // Filter out drafts (status defaults to "published" if undefined)
  if (article.status === "draft") {
    return false;
  }

  if (article.visible === false) {
    return false;
  }

  // Filter out future-dated articles
  const publishedAt = new Date(article.published_at);
  if (publishedAt.getTime() > now.getTime()) {
    return false;
  }

  return true;
};

/**
 * Filter out articles that should not be visible:
 * - Articles with status: "draft"
 * - Articles with published_at date in the future
 *
 * @see Story 6.2: Article Publishing
 */
const filterPublishedArticles = (articles: Articles): Articles => {
  return articles.filter(isArticlePublished);
};

/**
 * Sort articles by published_at descending (newest first)
 */
const sortByPublishedDate = (articles: Articles): Articles => {
  return [...articles].sort(
    (a, b) =>
      new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );
};

const Article = {
  async fetchAll({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<Articles> {
    if (useMockFallback) {
      logger.mock("Article", "articles", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const parsed = ArticlesSchema.parse(mockData);
      const filtered = filterPublishedArticles(parsed);
      return sortByPublishedDate(filtered);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      const parsed = ArticlesSchema.parse(data);
      const filtered = filterPublishedArticles(parsed);
      return sortByPublishedDate(filtered);
    } catch (error) {
      logger.error("Article", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback = true }: FetchOptions = {}
  ): Promise<ArticleType | null> {
    if (useMockFallback) {
      logger.mock("Article", "article", { id, delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const article = mockData.find((item) => item.id === id);
      // Return null if article not found or not published
      if (!article || !isArticlePublished(article)) {
        return null;
      }
      return ArticleSchema.parse(article);
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      const parsed = ArticleSchema.parse(data);
      // Respect publish filtering even from API
      if (!isArticlePublished(parsed)) {
        return null;
      }
      return parsed;
    } catch (error) {
      logger.error("Article", `fetchById(${id}) failed`, error);
      throw error;
    }
  },

  async fetchBySlug(
    slug: string,
    { useMockFallback = true }: FetchOptions = {}
  ): Promise<ArticleType | null> {
    if (useMockFallback) {
      logger.mock("Article", "article", { slug, delay: "500ms" });
      // Shorter delay for SSR performance
      await new Promise((resolve) => setTimeout(resolve, 500));
      const article = mockData.find((item) => item.slug === slug);
      // Return null if article not found or not published
      if (!article || !isArticlePublished(article)) {
        return null;
      }
      return ArticleSchema.parse(article);
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/slug/${slug}`);
      const parsed = ArticleSchema.parse(data);
      // Respect publish filtering even from API
      if (!isArticlePublished(parsed)) {
        return null;
      }
      return parsed;
    } catch (error) {
      logger.error("Article", `fetchBySlug(${slug}) failed`, error);
      return null;
    }
  },

  async fetchAllForAdmin(): Promise<Articles> {
    if (isMemoryDriver()) {
      return ArticlesSchema.parse(memoryStore.getArticles());
    }

    const { db } = await import("../../../db");
    const { contentArticles } = await import("../../../db/schema");
    const rows = await db.select().from(contentArticles);

    const normalized = rows.map((row) => ({
      id: row.id,
      title: row.title,
      url: row.url,
      slug: row.slug,
      lang: row.lang,
      reading_time: row.readingTime,
      published_at: row.publishedAt,
      summary: row.summary,
      content: row.content ?? undefined,
      img: row.img,
      img_alt: row.imgAlt ?? undefined,
      featured: row.featured,
      visible: row.visible,
      priority: row.priority,
      category: row.category ?? undefined,
      badges: row.badges ?? undefined,
      status: row.status,
    }));

    return ArticlesSchema.parse(normalized);
  },

  async updateById(id: number, payload: ArticleType): Promise<ArticleType> {
    if (isMemoryDriver()) {
      const items = memoryStore.getArticles();
      const idx = items.findIndex((item) => item.id === id);

      if (idx === -1) {
        throw new Error(`Article ${id} not found`);
      }

      const normalized = ArticleSchema.parse({ ...payload, id });
      items[idx] = normalized;
      memoryStore.setArticles(items);
      return normalized;
    }

    const normalized = ArticleSchema.parse({ ...payload, id });

    const { db } = await import("../../../db");
    const { contentArticles } = await import("../../../db/schema");

    const existing = await db
      .select({ id: contentArticles.id })
      .from(contentArticles)
      .where(eq(contentArticles.id, id))
      .limit(1);

    if (existing.length === 0) {
      throw new Error(`Article ${id} not found`);
    }

    await db
      .update(contentArticles)
      .set({
        title: normalized.title,
        url: normalized.url,
        slug: normalized.slug,
        lang: normalized.lang,
        readingTime: normalized.reading_time,
        publishedAt: normalized.published_at,
        summary: normalized.summary,
        content: normalized.content ?? null,
        img: normalized.img,
        imgAlt: normalized.img_alt ?? null,
        featured: normalized.featured,
        visible: normalized.visible ?? true,
        priority: normalized.priority ?? 0,
        category: normalized.category ?? null,
        badges: normalized.badges ?? null,
        status: normalized.status ?? "published",
        updatedAt: new Date(),
      })
      .where(eq(contentArticles.id, id));

    return normalized;
  },
};

export default Article;
