"use client";

// import "./styles.css";

import { useSelector, useDispatch } from "react-redux";
import { toggleChat } from "@/slices/chat/chatSlice";

const ChatIcon = () => <>Chat Icon</>;

export function ChatButton() {
  const dispatch = useDispatch();
  const { isChatOpen } = useSelector((state) => state.chat);

  return (
    <button
      className="chat_button"
      id="chatButtonId"
      onClick={() => dispatch(toggleChat())}
    >
      <ChatIcon isOpen={isChatOpen} />
    </button>
  );
}
