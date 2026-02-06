import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData from "./mock";
import {
  ContentsSchema,
  ContentSchema,
  type ContentsModel,
  type ContentModel,
} from "./schema";

const ENDPOINT = "contents";

interface FetchOptions {
  useMockFallback?: boolean;
}

const Content = {
  async fetchAll({
    useMockFallback = true,
  }: FetchOptions = {}): Promise<ContentsModel> {
    if (useMockFallback) {
      logger.mock("Content", "contents", { delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return ContentsSchema.parse(mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return ContentsSchema.parse(data);
    } catch (error) {
      logger.error("Content", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback = true }: FetchOptions = {}
  ): Promise<ContentModel> {
    if (useMockFallback) {
      logger.mock("Content", "content", { id, delay: "2s" });
      // Simulate network delay (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const content = mockData.find((item) => item.id === id) || mockData[0];
      return ContentSchema.parse(content);
    }

    try {
      const data = await httpRequest(`${ENDPOINT}/${id}`);
      return ContentSchema.parse(data);
    } catch (error) {
      logger.error("Content", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Content;
