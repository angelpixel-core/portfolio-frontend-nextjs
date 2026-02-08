import useAuthPanel from "@/state/slices/authPanel/hooks";
import type { AuthUser } from "@/services/auth/types";

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: AuthUser | null;
  error: string | null;
  login: (_user: AuthUser) => void;
  logout: () => void;
  clearError: () => void;
}

/**
 * Semantic auth hook - exposes authentication state without panel UI concerns.
 * Use this when you need auth state (isAuthenticated, user, login/logout).
 * For panel open/close control, use useAuthPanel directly.
 *
 * `login(user)` updates Redux state after a successful auth flow (e.g. after
 * mockLogin resolves). It does NOT trigger the login request itself.
 */
const useAuth = (): UseAuthReturn => {
  const { isAuthenticated, user, error, loginSuccess, logout, clearError } =
    useAuthPanel();

  return {
    isAuthenticated,
    user,
    error,
    login: loginSuccess,
    logout,
    clearError,
  };
};

export default useAuth;
