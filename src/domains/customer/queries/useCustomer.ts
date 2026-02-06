import { createFetchByIdHook } from "@/lib/createQueryHook";
import model from "../model";
import type { CustomerModel } from "./../model/schema";

const useCustomer = createFetchByIdHook<CustomerModel, number>({
  queryKey: "customer",
  fetchFn: (id) => model.fetchById(id),
});

export default useCustomer;
