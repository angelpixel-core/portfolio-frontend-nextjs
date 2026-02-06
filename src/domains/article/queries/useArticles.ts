import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { Articles } from "./../model/schema";

const useArticles = createFetchAllHook<Articles>({
  queryKey: "articles",
  fetchFn: () => model.fetchAll(),
});

export default useArticles;
