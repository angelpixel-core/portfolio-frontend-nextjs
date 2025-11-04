import { useQuery } from "@tanstack/react-query";
import model from "./../model";

const QUERY_KEY = "content";

const useContent = (id, { enabled = !!id } = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => model.fetchById(id),
    staleTime: 1000 * 60 * 5, // 5 min
    cacheTime: 1000 * 60 * 10, // 10 min
    // // suspense: true, // Removed - causing infinite loops // Removed - causing infinite loops with client components
  });
};

export default useContent;
