"use client";

import "./styles.css";

import { FloatingMobile } from "@/overlays";
import ChatBox from "./ChatBox";
import { ChatButton } from "@/buttons";
import { useChatPanel } from "@/state/slices";

const Chat = () => {
  const { isOpen } = useChatPanel();

  return (
    <>
      <ChatButton />
      {isOpen && (
        <FloatingMobile id="chatPanel" title="Contact Form">
          <ChatBox />
        </FloatingMobile>
      )}
    </>
  );
};

export default Chat;
