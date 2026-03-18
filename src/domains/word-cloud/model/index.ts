import { resolveContentSource } from "@/lib/content-source";
import { logger } from "@/lib/logger";
import { WordCloudConceptsSchema, type ConceptsModel } from "./schema";

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
