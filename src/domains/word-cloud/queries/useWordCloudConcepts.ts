import { createFetchAllHook } from "@/lib/createQueryHook";
import { resolveEnvContentSource } from "@/lib/content-source";
import model from "../model";
import { WordCloudConceptsSchema, type ConceptsModel } from "../model/schema";
import { WORD_CLOUD_ENV_KEY } from "../model";

const envConcepts = resolveEnvContentSource({
  envKey: WORD_CLOUD_ENV_KEY,
  schema: WordCloudConceptsSchema,
  defaultEnvValue: "file:word-cloud-concepts.json",
});

const useWordCloudConcepts = createFetchAllHook<ConceptsModel>({
  queryKey: "word-cloud-concepts",
  initialData: envConcepts,
  fetchFn: async () => {
    const data = await model.fetchAll();
    return WordCloudConceptsSchema.parse(data);
  },
});

export default useWordCloudConcepts;
