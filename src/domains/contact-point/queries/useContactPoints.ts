import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import { ContactPointsSchema, type ContactPointsModel } from "../model/schema";

const useContactPoints = createFetchAllHook<ContactPointsModel>({
  queryKey: "contact-points",
  fetchFn: async () => {
    const data = await model.fetchAll();
    return ContactPointsSchema.parse(data);
  },
});

export default useContactPoints;
