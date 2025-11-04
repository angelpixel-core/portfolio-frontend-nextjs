import { useQuery } from "@tanstack/react-query";
import model from "./../model";

const QUERY_KEY = "customer";

const useCustomer = (id, { enabled = !!id } = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => model.fetchById(id),
    enabled,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    // suspense: true, // Removed - causing infinite loops
  });
};

export default useCustomer;
