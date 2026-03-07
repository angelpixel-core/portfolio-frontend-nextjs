import { default as httpRequest } from "@/lib/httpRequest";
import { logger } from "@/lib/logger";
import mockData, { getWordCloudConcepts } from "./mock";
import { WordCloudConceptsSchema, type ConceptsModel } from "./schema";

const ENDPOINT = "word-cloud-concepts";

interface FetchOptions {
  useMockFallback?: boolean;
}

const resolveUseMockFallback = (value?: boolean): boolean => {
  if (typeof value === "boolean") {
    return value;
  }

  return process.env.NEXT_PUBLIC_USE_MOCKS === "true";
};

const WordCloudModel = {
  async fetchAll(options: FetchOptions = {}): Promise<ConceptsModel> {
    const useMockFallback = resolveUseMockFallback(options.useMockFallback);

    if (useMockFallback) {
      logger.mock("WordCloud", "concepts");
      return WordCloudConceptsSchema.parse(getWordCloudConcepts() || mockData);
    }

    try {
      const data = await httpRequest(ENDPOINT);
      return WordCloudConceptsSchema.parse(data);
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
