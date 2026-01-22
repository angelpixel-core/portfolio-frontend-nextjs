import { useQuery } from "@tanstack/react-query";
import model from "../model";
import type { ProfileModel } from "../model/schema";

const QUERY_KEY = "profile";

interface UseProfileOptions {
  enabled?: boolean;
}

export function useProfile(
  id: number | undefined,
  { enabled = !!id }: UseProfileOptions = {}
) {
  return useQuery<ProfileModel>({
    queryKey: [QUERY_KEY, id],
    queryFn: () => model.fetchById(id as number),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useProfile;
