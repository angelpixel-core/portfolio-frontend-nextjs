"use client";

import { useQuery } from "@tanstack/react-query";
import { Technology } from "@/models";

export const useTechnologies = () => {
  return useQuery({
    queryKey: ["technologies"],
    queryFn: Technology.fetchAll,
    suspense: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

// export default useTechnologies;
