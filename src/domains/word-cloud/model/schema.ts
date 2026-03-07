import { z } from "zod";

export const WordCloudTechnologySchema = z.object({
  name: z.string(),
  icon: z.string(),
});

export const WordCloudConceptSchema = z.object({
  id: z.string(),
  label: z.string(),
  weight: z.number().min(1).max(5),
  description: z.string(),
  relatedKeywords: z.array(z.string()),
  technologies: z.array(WordCloudTechnologySchema),
  companies: z.array(z.string()),
});

export const WordCloudConceptsSchema = z.array(WordCloudConceptSchema);

export type Technology = z.infer<typeof WordCloudTechnologySchema>;
export type Concept = z.infer<typeof WordCloudConceptSchema>;
export type ConceptsModel = z.infer<typeof WordCloudConceptsSchema>;

export default WordCloudConceptSchema;
