import { resolveEnvContentSource } from "@/lib/content-source";
import { WORD_CLOUD_ENV_KEY } from "@/domains/word-cloud/model";
import { getWordCloudConcepts } from "@/domains/word-cloud/model/mock";
import {
  WordCloudConceptsSchema,
  type Concept,
  type Technology,
} from "@/domains/word-cloud/model/schema";

export type { Concept, Technology };

let envConcepts: Concept[] | undefined;

try {
  envConcepts = resolveEnvContentSource({
    envKey: WORD_CLOUD_ENV_KEY,
    schema: WordCloudConceptsSchema,
    defaultEnvValue: "file:word-cloud-concepts.json",
  });
} catch {
  envConcepts = undefined;
}

export const CONCEPTS: Concept[] = envConcepts ?? getWordCloudConcepts();

export const getWeightClass = (weight: number): string => {
  const sizeMap: Record<number, string> = {
    5: "word-cloud__word--xl",
    4: "word-cloud__word--lg",
    3: "word-cloud__word--md",
    2: "word-cloud__word--sm",
    1: "word-cloud__word--xs",
  };
  return sizeMap[weight] || sizeMap[3];
};
