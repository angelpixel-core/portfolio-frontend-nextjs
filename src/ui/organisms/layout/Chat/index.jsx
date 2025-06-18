"use client";

import "./styles.css";

import { useSelector } from "react-redux";

import { ChatButton } from "@/atoms/buttons";
import { FloatingMobile } from "@/atoms/hocs";
import ChatBox from "./ChatBox";

export function Chat() {
  const { isChatOpen } = useSelector((state) => state.chat);

  return (
    <>
      <ChatButton />

      {isChatOpen ? (
        <FloatingMobile id="chat">
          <ChatBox />
        </FloatingMobile>
      ) : null}
    </>
  );
}
