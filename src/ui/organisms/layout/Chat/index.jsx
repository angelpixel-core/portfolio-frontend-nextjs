"use client";

import "./styles.css";

import { useSelector } from "react-redux";

import { ChatButton } from "@/atoms/buttons/_index";
import { Floating } from "@/atoms/hocs/_index";
import ChatBox from "./ChatBox";

export function Chat() {
  const { isChatOpen } = useSelector((state) => state.chat);

  return (
    <>
      <ChatButton />

      {isChatOpen ? (
        <Floating id="chat">
          <ChatBox />
        </Floating>
      ) : null}
    </>
  );
}
