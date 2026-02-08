"use client";

import { FormEvent } from "react";

import { EmailBox } from "./Form/EmailBox";
import { JobTypeBox } from "./Form/JobTypeBox";
import { MessageBox } from "./Form/MessageBox";
import { AttachmentBox } from "./Form/AttachmentBox";
import { Submit } from "./Form/Submit";

import { logger } from "@/lib/logger";
import { useChatPanel } from "@/state/slices";

export default function ChatBox() {
  const { closeChatPanel } = useChatPanel();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch("/api/messages", {
      method: "POST",
      body: new FormData(event.currentTarget),
    })
      .then((res) => res)
      .catch((err) => logger.error("Chat", "Failed to submit form", err));

    if (response && response.ok) {
      closeChatPanel();
      logger.debug("Chat", "Form submitted successfully");
    } else if (response) {
      const { message } = await response.json();
      logger.error("Chat", "Server returned error", message);
    }
  };

  return (
    <form id="chatbox_form" className="chatbox_form" onSubmit={handleSubmit}>
      <EmailBox />

      <JobTypeBox />

      <MessageBox />

      <AttachmentBox />

      <Submit text="Send Message" />
    </form>
  );
}
