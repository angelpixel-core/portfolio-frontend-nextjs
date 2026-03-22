import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";
import { DEFAULT_GC_TIME, DEFAULT_STALE_TIME } from "@/lib/queryConfig";
import model, { normalizeVisibility } from "../model";
import type { ProjectVisibility } from "../model";
import type { ProjectsModel } from "../model/schema";

export interface UseProjectsOptions {
  visibility?: ProjectVisibility | string;
}

const useProjects = (
  options: UseProjectsOptions = {}
): UseQueryResult<ProjectsModel, Error> => {
  const visibility = normalizeVisibility(options.visibility);

  return useQuery<ProjectsModel, Error>({
    queryKey: ["projects", visibility],
    queryFn: () => model.fetchAll({ visibility }),
    staleTime: DEFAULT_STALE_TIME,
    gcTime: DEFAULT_GC_TIME,
  });
};

export default useProjects;
