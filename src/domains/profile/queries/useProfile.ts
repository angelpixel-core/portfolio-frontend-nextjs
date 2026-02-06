import { createFetchByIdHook } from "@/lib/createQueryHook";
import model from "../model";
import type { ProfileModel } from "../model/schema";

const useProfile = createFetchByIdHook<ProfileModel, number>({
  queryKey: "profile",
  fetchFn: (id) => model.fetchById(id),
});

export default useProfile;
