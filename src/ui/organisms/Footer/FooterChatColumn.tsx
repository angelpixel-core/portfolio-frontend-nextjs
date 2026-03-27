"use client";

import dynamic from "next/dynamic";
import ChatButton from "@/buttons/ChatButton";

const ChatOverlay = dynamic(() => import("@/organisms/Chat/ChatOverlay"), {
  ssr: false,
});

const FooterChatColumn = () => {
  return (
    <>
      <ChatButton showArrow arrowSize="large" />
      <ChatOverlay />
    </>
  );
};

export default FooterChatColumn;
