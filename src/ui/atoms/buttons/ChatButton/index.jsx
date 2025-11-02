"use client";

import "./styles.css";
import { useChatPanel } from "@/state/slices";

const ChatIcon = ({ isOpen }) => <>{isOpen ? "Cerrar Chat" : "Say Hello!"}</>;

const ChatButton = () => {
  const { isOpen, toggle } = useChatPanel();

  return (
    <button
      className={`chat_button ${isOpen ? "chat_button--active" : ""}`}
      id="chatButtonId"
      onClick={toggle}
    >
      <ChatIcon isOpen={isOpen} />
    </button>
  );
};

export default ChatButton;
