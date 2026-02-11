"use client";

import "./styles.css";
import useChatPanel from "@/state/slices/chatPanel/hooks";

interface ChatIconProps {
  isOpen: boolean;
}

const ChatIcon = ({ isOpen }: ChatIconProps) => (
  <>{isOpen ? "Close Chat" : "Say Hello!"}</>
);

const preloadChatOverlay = () => {
  import("@/organisms/Chat/ChatOverlay");
};

const ChatButton = () => {
  const { isOpen, toggleChatPanel } = useChatPanel();

  const ariaLabel = isOpen ? "Close chat panel" : "Open chat panel";

  return (
    <button
      className={`chat_button focus-ring ${isOpen ? "chat_button--active" : ""}`}
      id="chatButtonId"
      onClick={toggleChatPanel}
      onMouseEnter={preloadChatOverlay}
      onFocus={preloadChatOverlay}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="chatPanelFloating"
    >
      <ChatIcon isOpen={isOpen} />
    </button>
  );
};

export default ChatButton;
