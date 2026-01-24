import { useQuery } from "@tanstack/react-query";
import model from "../model";
import { ContactPointsSchema, type ContactPointsModel } from "../model/schema";

const QUERY_KEY = "contact-points";

interface UseContactPointsOptions {
  enabled?: boolean;
}

export function useContactPoints({
  enabled = true,
}: UseContactPointsOptions = {}) {
  return useQuery<ContactPointsModel>({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const data = await model.fetchAll();
      return ContactPointsSchema.parse(data);
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useContactPoints;
