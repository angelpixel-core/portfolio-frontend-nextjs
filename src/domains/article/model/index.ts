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
      return sortByPublishedDate(parsed);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      const parsed = ArticlesSchema.parse(data);
      return sortByPublishedDate(parsed);
    } catch (error) {
      logger.error("Article", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback = true }: FetchOptions = {}
  ): Promise<ArticleType> {
    if (useMockFallback) {
      logger.mock("Article", "article", { id, delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const article = mockData.find((item) => item.id === id) ?? mockData[0];
      return ArticleSchema.parse(article);
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      return ArticleSchema.parse(data);
    } catch (error) {
      logger.error("Article", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Article;
