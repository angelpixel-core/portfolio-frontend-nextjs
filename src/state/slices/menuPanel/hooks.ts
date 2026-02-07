import { useAppSelector, useAppDispatch } from "@/hooks/store";
import type { RootState } from "@/state/stores";
import {
  setMenuPanel,
  openMenuPanel,
  closeMenuPanel,
  toggleMenuPanel,
} from "./slice";

interface UseMenuPanelReturn {
  isOpen: boolean;
  setMenuPanel: (_value: boolean) => void;
  openMenuPanel: () => void;
  closeMenuPanel: () => void;
  toggleMenuPanel: () => void;
}

const useMenuPanel = (): UseMenuPanelReturn => {
  const isOpen = useAppSelector((state: RootState) => state.menuPanel.isOpen);
  const dispatch = useAppDispatch();

  return {
    isOpen,
    setMenuPanel: (value: boolean) => dispatch(setMenuPanel(value)),
    openMenuPanel: () => dispatch(openMenuPanel()),
    closeMenuPanel: () => dispatch(closeMenuPanel()),
    toggleMenuPanel: () => dispatch(toggleMenuPanel()),
  };
};

export default useMenuPanel;
