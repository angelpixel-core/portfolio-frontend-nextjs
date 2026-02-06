import { createFetchByIdHook } from "@/lib/createQueryHook";
import model from "../model";
import type { ContentModel } from "./../model/schema";

const useContent = createFetchByIdHook<ContentModel, number>({
  queryKey: "content",
  fetchFn: (id) => model.fetchById(id),
});

export default useContent;
