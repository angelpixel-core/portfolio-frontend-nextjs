import { useQuery } from "@tanstack/react-query";
import model from "./../model";

const QUERY_KEY = "customer";

interface UseCustomerOptions {
  enabled?: boolean;
}

const useCustomer = (
  id: number,
  { enabled = !!id }: UseCustomerOptions = {}
) => {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => model.fetchById(id),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export default useCustomer;
