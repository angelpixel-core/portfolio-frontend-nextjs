import { createFetchAllHook } from "@/lib/createQueryHook";
import type { ProfilesModel } from "../model/schema";

const fetchProfiles = async (): Promise<ProfilesModel> => {
  const response = await fetch("/api/profiles", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profiles");
  }

  return (await response.json()) as ProfilesModel;
};

const useProfiles = createFetchAllHook<ProfilesModel>({
  queryKey: "profiles",
  fetchFn: fetchProfiles,
});

export default useProfiles;
