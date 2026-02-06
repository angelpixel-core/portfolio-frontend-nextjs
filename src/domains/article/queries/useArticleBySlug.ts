import { createFetchByIdHook } from "@/lib/createQueryHook";
import model from "../model";
import type { Article } from "./../model/schema";

const useArticleBySlug = createFetchByIdHook<Article, string>({
  queryKey: "article-by-slug",
  fetchFn: (slug) => model.fetchBySlug(slug),
});

export default useArticleBySlug;
