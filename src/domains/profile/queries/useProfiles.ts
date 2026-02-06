import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { ProfilesModel } from "../model/schema";

const useProfiles = createFetchAllHook<ProfilesModel>({
  queryKey: "profiles",
  fetchFn: () => model.fetchAll(),
});

export default useProfiles;
