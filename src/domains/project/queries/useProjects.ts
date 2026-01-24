import { useQuery } from "@tanstack/react-query";
import model from "../model";
import type { ProjectsModel } from "../model/schema";

const QUERY_KEY = "projects";

export function useProjects() {
  return useQuery<ProjectsModel>({
    queryKey: [QUERY_KEY],
    queryFn: () => model.fetchAll(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useProjects;
