import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { ExperienceStatsModel } from "./../model/schema";

const useExperienceStats = createFetchAllHook<ExperienceStatsModel>({
  queryKey: "experience-stats",
  fetchFn: () => model.fetchAll(),
});

export default useExperienceStats;
