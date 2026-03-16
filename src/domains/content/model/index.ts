import { resolveContentSource } from "@/lib/content-source";
import { logger } from "@/lib/logger";
import {
  ContentsSchema,
  ContentSchema,
  type ContentsModel,
  type ContentModel,
} from "./schema";

const ENDPOINT = "contents";
const ENV_KEY = "NEXT_PUBLIC_CONTENTS";

interface FetchOptions {
  useMockFallback?: boolean;
}

const Content = {
  async fetchAll({
    useMockFallback: _useMockFallback = true,
  }: FetchOptions = {}): Promise<ContentsModel> {
    try {
      return await resolveContentSource({
        envKey: ENV_KEY,
        schema: ContentsSchema,
        endpoint: ENDPOINT,
      });
    } catch (error) {
      logger.error("Content", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchById(
    id: number,
    { useMockFallback: _useMockFallback = true }: FetchOptions = {}
  ): Promise<ContentModel> {
    try {
      const contents = await Content.fetchAll();
      const content = contents.find((item) => item.id === id) || contents[0];
      return ContentSchema.parse(content);
    } catch (error) {
      logger.error("Content", `fetchById(${id}) failed`, error);
      throw error;
    }
  },
};

export default Content;
