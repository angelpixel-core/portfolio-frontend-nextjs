import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { JobExperiences } from "../model/schema";

const useJobExperiences = createFetchAllHook<JobExperiences>({
  queryKey: "job-experiences",
  fetchFn: () => model.fetchAll(),
});

export default useJobExperiences;
