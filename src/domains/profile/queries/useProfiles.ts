import { useQuery } from "@tanstack/react-query";
import model from "../model";
import type { ProfilesModel } from "../model/schema";

const QUERY_KEY = "profiles";

export function useProfiles() {
  return useQuery<ProfilesModel>({
    queryKey: [QUERY_KEY],
    queryFn: () => model.fetchAll(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useProfiles;
