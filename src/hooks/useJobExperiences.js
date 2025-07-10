"use client";

import { useQuery } from "@tanstack/react-query";
import { JobExperience } from "@/models";

export const useJobExperiences = () => {
  return useQuery({
    queryKey: ["job-experiences"],
    queryFn: JobExperience.fetchAll,
    suspense: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

// export default useJobExperiences;
