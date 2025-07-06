import { useSelector, useDispatch } from "react-redux";
import { toggle, setIsOpen } from "./slice";

export const useChatPanel = () => {
  const isOpen = useSelector((state) => state.chatPanel.isOpen);
  const dispatch = useDispatch();

  return {
    isOpen,
    open: () => dispatch(setIsOpen(true)),
    close: () => dispatch(setIsOpen(false)),
    toggle: () => dispatch(toggle()),
  };
};

// USAGE SAMPLE
//
// import { useChatPanel } from "@/state/slices/emailCopy";
//
// const { isOpen, open, close, toggle } = useChatPanel();
