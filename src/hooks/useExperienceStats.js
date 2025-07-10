"use client";

import { useQuery } from "@tanstack/react-query";
import { ExperienceStat } from "@/models";

export const useExperienceStats = () => {
  return useQuery({
    queryKey: ["experience-stats"],
    queryFn: ExperienceStat.fetchAll,
    suspense: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

// export default useExperienceStats;
