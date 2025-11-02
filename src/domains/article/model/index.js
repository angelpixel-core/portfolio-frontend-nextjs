import { default as httpRequest } from "@/lib/httpRequest";
import mockData from "./mock";

const ENDPOINT = "articles";

const Article = {
  async fetchAll({ useMockFallback = true } = {}) {
    try {
      const data = await httpRequest(ENDPOINT);
      return data;
    } catch (error) {
      console.error("🔴 Article.fetchAll error:", error);

      if (useMockFallback) {
        console.warn("⚠️  Using mock data for articles.");
        return mockData;
      }

      throw error;
    }
  },
};

export default Article;
