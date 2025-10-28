"use client";

import { useQuery } from "@tanstack/react-query";
import { Feature } from "@/models";

const useFeatures = () => {
  return useQuery({
    queryKey: ["features"],
    queryFn: Feature.fetchAll,
    suspense: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

export default useFeatures;
