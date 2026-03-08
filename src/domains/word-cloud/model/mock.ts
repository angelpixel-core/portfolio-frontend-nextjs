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
  const envConcepts = process.env.NEXT_PUBLIC_WORD_CLOUD_CONCEPTS?.trim();

  if (!envConcepts) {
    return baselineConcepts;
  }

  try {
    const parsed = JSON.parse(envConcepts) as unknown;
    const validation = WordCloudConceptsSchema.safeParse(parsed);

    if (validation.success) {
      return validation.data;
    }

    logger.warn(
      "WordCloud",
      "Invalid NEXT_PUBLIC_WORD_CLOUD_CONCEPTS shape, using baseline concepts"
    );
    return baselineConcepts;
  } catch {
    logger.warn(
      "WordCloud",
      "Failed to parse NEXT_PUBLIC_WORD_CLOUD_CONCEPTS, using baseline concepts"
    );
    return baselineConcepts;
  }
};

export default getWordCloudConcepts();
