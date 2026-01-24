import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import { ArticleSchema, ArticlesSchema } from "./schema";

const ENDPOINT = "articles";

const Article = {
  async fetchAll({ useMockFallback = true } = {}) {
    if (useMockFallback) {
      logger.mock("Article", "articles", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return ArticlesSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return ArticlesSchema.parse(data);
    } catch (error) {
      logger.error("Article", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(id, { useMockFallback = true } = {}) {
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
