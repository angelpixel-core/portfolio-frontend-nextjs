import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { ProjectsModel } from "../model/schema";

const useProjects = createFetchAllHook<ProjectsModel>({
  queryKey: "projects",
  fetchFn: () => model.fetchAll(),
});

export default useProjects;
