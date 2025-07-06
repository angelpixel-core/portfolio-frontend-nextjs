import { useSelector, useDispatch } from "react-redux";
import { setOpen, toggle } from "./slice";

export const useMenuPanel = () => {
  const open = useSelector((state) => state.menuPanel.open);
  const dispatch = useDispatch();

  return {
    open,
    openMenu: () => dispatch(setOpen(true)),
    closeMenu: () => dispatch(setOpen(false)),
    toggleMenu: () => dispatch(toggle()),
  };
};
