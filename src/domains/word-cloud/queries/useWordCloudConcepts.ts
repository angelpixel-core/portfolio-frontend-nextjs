import { createFetchAllHook } from "@/lib/createQueryHook";
import { getWordCloudConcepts } from "../model/mock";
import model from "../model";
import { WordCloudConceptsSchema, type ConceptsModel } from "../model/schema";

const useWordCloudConcepts = createFetchAllHook<ConceptsModel>({
  queryKey: "word-cloud-concepts",
  initialData: getWordCloudConcepts(),
  fetchFn: async () => {
    const data = await model.fetchAll();
    return WordCloudConceptsSchema.parse(data);
  },
});

export default useWordCloudConcepts;
