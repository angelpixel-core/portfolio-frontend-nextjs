"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import ChatButton from "@/buttons/ChatButton";
import useChatPanel from "@/state/slices/chatPanel/hooks";

const ChatOverlay = dynamic(() => import("@/organisms/Chat/ChatOverlay"), {
  ssr: false,
});

const FooterChatColumn = () => {
  const { isOpen } = useChatPanel();
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);

  return (
    <>
      <ChatButton />
      {hasOpened && <ChatOverlay />}
    </>
  );
};

export default FooterChatColumn;
