import { useQuery } from "@tanstack/react-query";
import model from "./../model";

const QUERY_KEY = "job-experiences";

const useJobExperiences = () => {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: model fetchAll,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    suspense: true,
  });
};

export default useJobExperiences;
