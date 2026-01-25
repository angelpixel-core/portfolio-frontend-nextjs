import { useAppSelector, useAppDispatch } from "@/hooks/store";
import {
  setChatPanel,
  openChatPanel,
  closeChatPanel,
  toggleChatPanel,
  ChatPanelState,
} from "./slice";

interface UseChatPanelReturn {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  setChatPanel: (_value: boolean) => void;
  openChatPanel: () => void;
  closeChatPanel: () => void;
  toggleChatPanel: () => void;
}

const useChatPanel = (): UseChatPanelReturn => {
  const isOpen = useAppSelector(
    (state: { chatPanel: ChatPanelState }) => state.chatPanel.isOpen
  );
  const dispatch = useAppDispatch();

  return {
    isOpen,
    // Short aliases for common operations
    toggle: () => dispatch(toggleChatPanel()),
    open: () => dispatch(openChatPanel()),
    close: () => dispatch(closeChatPanel()),
    // Full names for explicit usage
    setChatPanel: (value: boolean) => dispatch(setChatPanel(value)),
    openChatPanel: () => dispatch(openChatPanel()),
    closeChatPanel: () => dispatch(closeChatPanel()),
    toggleChatPanel: () => dispatch(toggleChatPanel()),
  };
};

export default useChatPanel;
