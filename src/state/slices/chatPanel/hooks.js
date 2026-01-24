import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  setChatPanel,
  openChatPanel,
  closeChatPanel,
  toggleChatPanel,
} from "./slice";

const useChatPanel = () => {
  const isOpen = useAppSelector((state) => state.chatPanel.isOpen);
  const dispatch = useAppDispatch();

  return {
    isOpen,
    // Short aliases for common operations
    toggle: () => dispatch(toggleChatPanel()),
    open: () => dispatch(openChatPanel()),
    close: () => dispatch(closeChatPanel()),
    // Full names for explicit usage
    setChatPanel: (value) => dispatch(setChatPanel(value)),
    openChatPanel: () => dispatch(openChatPanel()),
    closeChatPanel: () => dispatch(closeChatPanel()),
    toggleChatPanel: () => dispatch(toggleChatPanel()),
  };
};

export default useChatPanel;
