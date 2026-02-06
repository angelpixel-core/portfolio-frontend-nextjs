import { createFetchByIdHook } from "@/lib/createQueryHook";
import model from "../model";
import type { ProjectModel } from "../model/schema";

const useProject = createFetchByIdHook<ProjectModel, string>({
  queryKey: "project",
  fetchFn: (slug) => model.fetchBySlug(slug),
});

export default useProject;
