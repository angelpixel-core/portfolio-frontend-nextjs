import { logger } from "@/lib/logger";
import realConceptsJson from "./real-concepts.json";
import { WordCloudConceptsSchema, type ConceptsModel } from "./schema";

const parseRealConcepts = (): ConceptsModel => {
  const parsed = realConceptsJson as unknown;
  const validation = WordCloudConceptsSchema.safeParse(parsed);

  if (validation.success) {
    return validation.data;
  }

  logger.warn(
    "WordCloud",
    "Invalid static real concepts JSON shape, using empty fallback"
  );
  return [];
};

const baselineConcepts = parseRealConcepts();

export const getWordCloudConcepts = (): ConceptsModel => {
  return baselineConcepts;
};

export default baselineConcepts;
