"use client";

import "./styles.css";

import { AnimatePresence } from "framer-motion";
import { FloatingMobile } from "@/overlays";
import ChatBox from "./ChatBox";
import { ChatButton } from "@/buttons";
import { useChatPanel } from "@/state/slices";

const Chat = () => {
  const { isOpen } = useChatPanel();

  return (
    <>
      <ChatButton />
      <AnimatePresence>
        {isOpen && (
          <FloatingMobile id="chatPanel" title="Contact Form">
            <ChatBox />
          </FloatingMobile>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chat;
