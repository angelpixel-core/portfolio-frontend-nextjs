import useAuthPanel from "@/state/slices/authPanel/hooks";
import type { AuthUser } from "@/services/auth/types";

/**
 * Returns the current authenticated user, or null if not authenticated.
 */
const useUser = (): AuthUser | null => {
  const { user } = useAuthPanel();
  return user;
};

export default useUser;
