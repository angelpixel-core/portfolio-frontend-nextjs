"use client";

import "./styles.css";
import { useChatPanel } from "@/state/slices/chatPanel";

const ChatIcon = ({ isOpen }) => <>{isOpen ? "Cerrar Chat" : "Say Hello!"}</>;

export default function ChatButton() {
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
}
