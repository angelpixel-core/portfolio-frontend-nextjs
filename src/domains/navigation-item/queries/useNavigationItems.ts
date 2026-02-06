import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { NavigationItemsModel } from "./../model/schema";

const useNavigationItems = createFetchAllHook<NavigationItemsModel>({
  queryKey: "navigation-items",
  fetchFn: () => model.fetchAll(),
});

export default useNavigationItems;
