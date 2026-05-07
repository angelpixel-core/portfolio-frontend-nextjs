import { createFetchByIdHook } from "@/lib/createQueryHook";
import type { ProfileModel } from "../model/schema";

const fetchProfileById = async (id: number): Promise<ProfileModel | null> => {
  const response = await fetch(`/api/profiles/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return (await response.json()) as ProfileModel;
};

const useProfile = createFetchByIdHook<ProfileModel, number>({
  queryKey: "profile",
  fetchFn: fetchProfileById,
});

export default useProfile;
