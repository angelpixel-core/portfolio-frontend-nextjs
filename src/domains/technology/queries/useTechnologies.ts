import { useQuery } from "@tanstack/react-query";
import model from "../model";
import { TechnologiesSchema, type TechnologiesModel } from "../model/schema";

const QUERY_KEY = "technologies";

interface UseTechnologiesOptions {
  enabled?: boolean;
}

export function useTechnologies({
  enabled = true,
}: UseTechnologiesOptions = {}) {
  return useQuery<TechnologiesModel>({
    queryKey: [QUERY_KEY],
    queryFn: async () => {
      const data = await model.fetchAll();
      return TechnologiesSchema.parse(data);
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useTechnologies;
