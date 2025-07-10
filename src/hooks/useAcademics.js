"use client";

import { useQuery } from "@tanstack/react-query";
import { Academic } from "@/models";

export const useAcademics = () => {
  return useQuery({
    queryKey: ["academics"],
    queryFn: Academic.fetchAll,
    suspense: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

// export default useAcademics;
