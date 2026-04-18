import { createFetchAllHook } from "@/lib/createQueryHook";
import model from "../model";
import type { TwoFactorStatus } from "../model/schema";

const useTwoFactorStatus = createFetchAllHook<TwoFactorStatus>({
  queryKey: "two-factor-status",
  fetchFn: () => model.fetchStatus(),
});

export default useTwoFactorStatus;
