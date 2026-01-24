import { useQuery } from "@tanstack/react-query";
import model from "../model";
import type { ProjectModel } from "../model/schema";

const QUERY_KEY = "project";

export function useProject(slug: string) {
  return useQuery<ProjectModel | null>({
    queryKey: [QUERY_KEY, slug],
    queryFn: () => model.fetchBySlug(slug),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    enabled: !!slug,
  });
}

export default useProject;
