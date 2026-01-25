import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import model from "./../model";
import type { Articles } from "./../model/schema";

const QUERY_KEY = "articles";

const useArticles = (): UseQueryResult<Articles, Error> => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: () => model.fetchAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime, deprecated in React Query 5.x)
  });
};

export default useArticles;
