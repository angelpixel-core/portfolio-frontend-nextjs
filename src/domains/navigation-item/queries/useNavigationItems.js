import { useQuery } from "@tanstack/react-query";
import model from "./../model";

const QUERY_KEY = "navigation-items";

const useNavigationItems = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: model.fetchAll,
    staleTime: 1000 * 60 * 5, // 5 min
    cacheTime: 1000 * 60 * 10, // 10 min
    suspense: true,
  });
};

export default useNavigationItems;
