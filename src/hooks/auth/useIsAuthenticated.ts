import useAuthPanel from "@/state/slices/authPanel/hooks";

/**
 * Returns whether the user is currently authenticated.
 * Simple boolean guard for conditional rendering or route protection.
 */
const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuthPanel();
  return isAuthenticated;
};

export default useIsAuthenticated;
