import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { Academics } from "../model/schema";

const useAcademics = createFetchAllHook<Academics>({
  queryKey: "academics",
  fetchFn: () => model.fetchAll(),
});

export default useAcademics;
