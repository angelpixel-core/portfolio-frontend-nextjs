import { useAppSelector, useAppDispatch } from "@/hooks/store";
import type { RootState } from "@/state/stores";
import {
  setAuthPanel,
  openAuthPanel,
  closeAuthPanel,
  toggleAuthPanel,
  loginSuccess,
  loginError,
  logout,
  clearError,
  AuthUser,
} from "./slice";

interface UseAuthPanelReturn {
  isOpen: boolean;
  isAuthenticated: boolean;
  user: AuthUser | null;
  error: string | null;
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
    (state: RootState) => state.authPanel
  );
  const dispatch = useAppDispatch();

  return {
    isOpen,
    isAuthenticated,
    user,
    error,
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
