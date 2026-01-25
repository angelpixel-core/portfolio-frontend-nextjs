"use client";

import "./styles.css";
import { useChatPanel } from "@/state/slices";

interface ChatIconProps {
  isOpen: boolean;
}

const ChatIcon = ({ isOpen }: ChatIconProps) => (
  <>{isOpen ? "Close Chat" : "Say Hello!"}</>
);

const ChatButton = () => {
  const { isOpen, toggle } = useChatPanel();

  const ariaLabel = isOpen ? "Close chat panel" : "Open chat panel";

  return (
    <button
      className={`chat_button ${isOpen ? "chat_button--active" : ""}`}
      id="chatButtonId"
      onClick={toggle}
      aria-label={ariaLabel}
      aria-expanded={isOpen}
      aria-controls="chatPanelFloating"
    >
      <ChatIcon isOpen={isOpen} />
    </button>
  );
};

export default ChatButton;
