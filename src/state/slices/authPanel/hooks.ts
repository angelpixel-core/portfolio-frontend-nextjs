import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  setAuthPanel,
  openAuthPanel,
  closeAuthPanel,
  toggleAuthPanel,
  loginSuccess,
  loginError,
  logout,
  clearError,
  AuthPanelState,
  AuthUser,
} from "./slice";

interface UseAuthPanelReturn {
  isOpen: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  error: string | null;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setAuthPanel: (_value: boolean) => void;
  openAuthPanel: () => void;
  closeAuthPanel: () => void;
  toggleAuthPanel: () => void;
  loginSuccess: (_user: AuthUser) => void;
  loginError: (_error: string) => void;
  logout: () => void;
  clearError: () => void;
}

const useAuthPanel = (): UseAuthPanelReturn => {
  const { isOpen, isAuthenticated, user, error } = useAppSelector(
    (state: { authPanel: AuthPanelState }) => state.authPanel
  );
  const dispatch = useAppDispatch();

  return {
    isOpen,
    isAuthenticated,
    user,
    error,
    // Short aliases for common operations
    toggle: () => dispatch(toggleAuthPanel()),
    open: () => dispatch(openAuthPanel()),
    close: () => dispatch(closeAuthPanel()),
    // Full names for explicit usage
    setAuthPanel: (value: boolean) => dispatch(setAuthPanel(value)),
    openAuthPanel: () => dispatch(openAuthPanel()),
    closeAuthPanel: () => dispatch(closeAuthPanel()),
    toggleAuthPanel: () => dispatch(toggleAuthPanel()),
    loginSuccess: (userData: AuthUser) => dispatch(loginSuccess(userData)),
    loginError: (errorMsg: string) => dispatch(loginError(errorMsg)),
    logout: () => dispatch(logout()),
    clearError: () => dispatch(clearError()),
  };
};

export default useAuthPanel;
