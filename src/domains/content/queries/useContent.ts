import { useQuery } from "@tanstack/react-query";
import model from "./../model";

const QUERY_KEY = "content";

interface UseContentOptions {
  enabled?: boolean;
}

const useContent = (id: number, { enabled = !!id }: UseContentOptions = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => model.fetchById(id),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled,
  });
};

export default useContent;
