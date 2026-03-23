import useAppSelector from "@/hooks/store/AppSelector";
import useAppDispatch from "@/hooks/store/AppDispatch";
import type { RootState } from "@/state/stores";
import {
  setChatPanel,
  openChatPanel,
  closeChatPanel,
  toggleChatPanel,
  setChatContext,
  clearChatContext,
} from "./slice";
import type { ChatPanelState } from "./slice";

interface UseChatPanelReturn {
  isOpen: boolean;
  context?: ChatPanelState["context"];
  setChatPanel: (_value: boolean) => void;
  openChatPanel: () => void;
  closeChatPanel: () => void;
  toggleChatPanel: () => void;
  setChatContext: (_context?: ChatPanelState["context"]) => void;
  clearChatContext: () => void;
}

const useChatPanel = (): UseChatPanelReturn => {
  const isOpen = useAppSelector((state: RootState) => state.chatPanel.isOpen);
  const context = useAppSelector((state: RootState) => state.chatPanel.context);
  const dispatch = useAppDispatch();

  return {
    isOpen,
    context,
    setChatPanel: (value: boolean) => dispatch(setChatPanel(value)),
    openChatPanel: () => dispatch(openChatPanel()),
    closeChatPanel: () => dispatch(closeChatPanel()),
    toggleChatPanel: () => dispatch(toggleChatPanel()),
    setChatContext: (payload) => dispatch(setChatContext(payload)),
    clearChatContext: () => dispatch(clearChatContext()),
  };
};

export default useChatPanel;
