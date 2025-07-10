"use client";

import { useQuery } from "@tanstack/react-query";
import { SocialNetwork } from "@/models";

export const useSocialNetworks = () => {
  return useQuery({
    queryKey: ["social-networks"],
    queryFn: SocialNetwork.fetchAll,
    suspense: true,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
  });
};

// export default useSocialNetworks;
