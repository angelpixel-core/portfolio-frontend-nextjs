"use client";

import { useQuery } from "@tanstack/react-query";
import { Profile } from "@/models";

export const useProfile = ({ id }) => {
  return useQuery({
    queryKey: [`profile/${id}`],
    queryFn: Profile.fetchBy({ id }),
    suspense: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};
