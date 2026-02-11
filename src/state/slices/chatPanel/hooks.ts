import useAppSelector from "@/hooks/store/AppSelector";
import useAppDispatch from "@/hooks/store/AppDispatch";
import type { RootState } from "@/state/stores";
import {
  setChatPanel,
  openChatPanel,
  closeChatPanel,
  toggleChatPanel,
} from "./slice";

interface UseChatPanelReturn {
  isOpen: boolean;
  setChatPanel: (_value: boolean) => void;
  openChatPanel: () => void;
  closeChatPanel: () => void;
  toggleChatPanel: () => void;
}

const useChatPanel = (): UseChatPanelReturn => {
  const isOpen = useAppSelector((state: RootState) => state.chatPanel.isOpen);
  const dispatch = useAppDispatch();

  return {
    isOpen,
    setChatPanel: (value: boolean) => dispatch(setChatPanel(value)),
    openChatPanel: () => dispatch(openChatPanel()),
    closeChatPanel: () => dispatch(closeChatPanel()),
    toggleChatPanel: () => dispatch(toggleChatPanel()),
  };
};

export default useChatPanel;
