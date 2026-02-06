import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import { TechnologiesSchema, type TechnologiesModel } from "../model/schema";

const useTechnologies = createFetchAllHook<TechnologiesModel>({
  queryKey: "technologies",
  fetchFn: async () => {
    const data = await model.fetchAll();
    return TechnologiesSchema.parse(data);
  },
});

export default useTechnologies;
