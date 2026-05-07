import { resolveContentSource } from "@/lib/content-source";
import { logger } from "@/lib/logger";
import { memoryStore } from "../../../db/memory-store";
import {
  WordCloudConceptSchema,
  WordCloudConceptsSchema,
  type Concept,
  type ConceptsModel,
} from "./schema";

const ENDPOINT = "word-cloud-concepts";
export const WORD_CLOUD_ENV_KEY = "NEXT_PUBLIC_WORD_CLOUD_CONCEPTS";

interface FetchOptions {
  useMockFallback?: boolean;
}

const WordCloudModel = {
  async fetchAll({
    useMockFallback: _useMockFallback = true,
  }: FetchOptions = {}): Promise<ConceptsModel> {
    try {
      return await resolveContentSource({
        envKey: WORD_CLOUD_ENV_KEY,
        schema: WordCloudConceptsSchema,
        endpoint: ENDPOINT,
        defaultEnvValue: "file:word-cloud-concepts.json",
      });
    } catch (error) {
      logger.error("WordCloud", "fetchAll failed", error);
      throw error;
    }
  },

  async fetchAllForAdmin(): Promise<ConceptsModel> {
    return WordCloudConceptsSchema.parse(memoryStore.getWordCloudConcepts());
  },

  async updateById(id: string, payload: Concept): Promise<Concept> {
    const items = memoryStore.getWordCloudConcepts();
    const idx = items.findIndex((item) => item.id === id);

    if (idx === -1) {
      throw new Error(`Word cloud concept ${id} not found`);
    }

    const normalized = WordCloudConceptSchema.parse({ ...payload, id });
    items[idx] = normalized;
    memoryStore.setWordCloudConcepts(items);
    return normalized;
  },
};

export default WordCloudModel;

export {
  WordCloudTechnologySchema,
  WordCloudConceptSchema,
  WordCloudConceptsSchema,
  type Technology,
  type Concept,
  type ConceptsModel,
} from "./schema";
