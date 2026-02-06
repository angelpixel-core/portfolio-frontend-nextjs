import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { CustomersModel } from "./../model/schema";

const useCustomers = createFetchAllHook<CustomersModel>({
  queryKey: "customers",
  fetchFn: () => model.fetchAll(),
});

export default useCustomers;
