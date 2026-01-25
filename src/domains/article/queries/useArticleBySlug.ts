import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import model from "./../model";
import type { Article } from "./../model/schema";

const QUERY_KEY = "article-by-slug";

interface UseArticleBySlugOptions {
  enabled?: boolean;
}

const useArticleBySlug = (
  slug: string,
  { enabled = !!slug }: UseArticleBySlugOptions = {}
): UseQueryResult<Article | null, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY, slug],
    queryFn: () => model.fetchBySlug(slug),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime, deprecated in React Query 5.x)
  });
};

export default useArticleBySlug;
