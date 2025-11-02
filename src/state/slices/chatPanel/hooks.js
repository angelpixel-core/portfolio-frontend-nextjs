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
    setChatPanel: (value) => dispatch(setChatPanel(value)),
    openChatPanel: () => dispatch(openChatPanel()),
    closeChatPanel: () => dispatch(closeChatPanel()),
    toggleChatPanel: () => dispatch(toggleChatPanel()),
  };
};

export default useChatPanel;
