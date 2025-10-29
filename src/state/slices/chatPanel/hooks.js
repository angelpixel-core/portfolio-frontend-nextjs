import { useSelector, useDispatch } from "react-redux";
import { setIsOpen, toggle } from "./slice";

const useChatPanel = () => {
  const isOpen = useSelector((state) => state.chatPanel.isOpen);
  const dispatch = useDispatch();

  return {
    isOpen,
    open: () => dispatch(setIsOpen(true)),
    close: () => dispatch(setIsOpen(false)),
    toggle: () => dispatch(toggle()),
  };
};

export default useChatPanel;
