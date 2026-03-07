import { logger } from "@/lib/logger";
import defaultConceptsJson from "./default-concepts.json";
import { WordCloudConceptsSchema, type ConceptsModel } from "./schema";

const parseDefaultConcepts = (): ConceptsModel => {
  const parsed = defaultConceptsJson as unknown;
  const validation = WordCloudConceptsSchema.safeParse(parsed);

  if (validation.success) {
    return validation.data;
  }

  logger.warn(
    "WordCloud",
    "Invalid static default concepts JSON shape, using empty fallback"
  );
  return [];
};

const defaultConcepts = parseDefaultConcepts();

export const getWordCloudConcepts = (): ConceptsModel => {
  const envConcepts = process.env.NEXT_PUBLIC_WORD_CLOUD_CONCEPTS?.trim();

  if (!envConcepts) {
    return defaultConcepts;
  }

  try {
    const parsed = JSON.parse(envConcepts) as unknown;
    const validation = WordCloudConceptsSchema.safeParse(parsed);

    if (validation.success) {
      return validation.data;
    }

    logger.warn(
      "WordCloud",
      "Invalid NEXT_PUBLIC_WORD_CLOUD_CONCEPTS shape, using defaults"
    );
    return defaultConcepts;
  } catch {
    logger.warn(
      "WordCloud",
      "Failed to parse NEXT_PUBLIC_WORD_CLOUD_CONCEPTS, using defaults"
    );
    return defaultConcepts;
  }
};

export default getWordCloudConcepts();
