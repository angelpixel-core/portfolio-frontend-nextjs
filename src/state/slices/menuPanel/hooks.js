import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  setMenuPanel,
  openMenuPanel,
  closeMenuPanel,
  toggleMenuPanel,
} from "./slice";

const useMenuPanel = () => {
  const isOpen = useAppSelector((state) => state.menuPanel.isOpen);
  const dispatch = useAppDispatch();

  return {
    isOpen,
    // Short aliases for common operations
    toggle: () => dispatch(toggleMenuPanel()),
    open: () => dispatch(openMenuPanel()),
    close: () => dispatch(closeMenuPanel()),
    // Full names for explicit usage
    setMenuPanel: (value) => dispatch(setMenuPanel(value)),
    openMenuPanel: () => dispatch(openMenuPanel()),
    closeMenuPanel: () => dispatch(closeMenuPanel()),
    toggleMenuPanel: () => dispatch(toggleMenuPanel()),
  };
};

export default useMenuPanel;
