import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { ContentsModel } from "./../model/schema";

const useContents = createFetchAllHook<ContentsModel>({
  queryKey: "contents",
  fetchFn: () => model.fetchAll(),
});

export default useContents;
