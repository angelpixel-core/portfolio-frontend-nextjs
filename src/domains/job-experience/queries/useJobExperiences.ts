import { useQuery } from "@tanstack/react-query";
import model, { type JobExperience } from "../model";

const QUERY_KEY = "job-experiences";

const useJobExperiences = () => {
  return useQuery<JobExperience[], Error>({
    queryKey: [QUERY_KEY],
    queryFn: () => model.fetchAll(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
  });
};

export default useJobExperiences;
