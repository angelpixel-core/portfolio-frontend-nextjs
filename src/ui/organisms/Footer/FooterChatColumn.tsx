"use client";

import dynamic from "next/dynamic";
import ChatButton from "@/buttons/ChatButton";
import useChatPanel from "@/state/slices/chatPanel/hooks";

const ChatOverlay = dynamic(() => import("@/organisms/Chat/ChatOverlay"), {
  ssr: false,
});

const FooterChatColumn = () => {
  const { isOpen } = useChatPanel();

  return (
    <>
      <ChatButton />
      {isOpen && <ChatOverlay />}
    </>
  );
};

export default FooterChatColumn;
