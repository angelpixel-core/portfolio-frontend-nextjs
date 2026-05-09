import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
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

const shouldUseMockFallbackByDefault = (): boolean => {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) return false;

  return process.env.NEXT_PUBLIC_USE_MOCKS === "true";
};

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
    useMockFallback = shouldUseMockFallbackByDefault(),
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
    { useMockFallback = shouldUseMockFallbackByDefault() }: FetchOptions = {}
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
    { useMockFallback = shouldUseMockFallbackByDefault() }: FetchOptions = {}
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
};

export default Article;
