import { getWordCloudConcepts } from "@/domains/word-cloud/model/mock";
import type { Concept, Technology } from "@/domains/word-cloud/model/schema";

export type { Concept, Technology };

export const CONCEPTS: Concept[] = getWordCloudConcepts();

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
