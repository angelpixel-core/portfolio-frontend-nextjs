import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import model from "./../model";
import type { Article } from "./../model/schema";

const QUERY_KEY = "article";

interface UseArticleOptions {
  enabled?: boolean;
}

const useArticle = (
  id: number,
  { enabled = !!id }: UseArticleOptions = {}
): UseQueryResult<Article, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => model.fetchById(id),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime, deprecated in React Query 5.x)
  });
};

export default useArticle;
