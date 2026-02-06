import { createFetchByIdHook } from "@/lib/createQueryHook";
import model from "../model";
import type { Article } from "./../model/schema";

const useArticle = createFetchByIdHook<Article, number>({
  queryKey: "article",
  fetchFn: (id) => model.fetchById(id),
});

export default useArticle;
