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
    setMenuPanel: (value) => dispatch(setMenuPanel(value)),
    openMenuPanel: () => dispatch(openMenuPanel()),
    closeMenuPanel: () => dispatch(closeMenuPanel()),
    toggleMenuPanel: () => dispatch(toggleMenuPanel()),
  };
};

export default useMenuPanel;
