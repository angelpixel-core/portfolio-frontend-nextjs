"use client";

import "./styles.css";

import { AnimatePresence } from "framer-motion";
import FloatingMobile from "@/overlays/FloatingMobile";
import ChatBox from "./ChatBox";
import useChatPanel from "@/state/slices/chatPanel/hooks";

const ChatOverlay = () => {
  const { isOpen } = useChatPanel();

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <FloatingMobile id="chatPanel" title="Contact Form" key="chat-panel">
          <ChatBox key="chatbox-form" />
        </FloatingMobile>
      )}
    </AnimatePresence>
  );
};

export default ChatOverlay;
