import { useQuery } from "@tanstack/react-query";
import model from "../model";
import type { Academics } from "../model/schema";

const QUERY_KEY = "academics";

/**
 * Hook to fetch academic credentials
 * Story 3.3: Academic Background
 */
const useAcademics = () => {
  return useQuery<Academics>({
    queryKey: [QUERY_KEY],
    queryFn: () => model.fetchAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (was cacheTime - deprecated)
  });
};

export default useAcademics;
