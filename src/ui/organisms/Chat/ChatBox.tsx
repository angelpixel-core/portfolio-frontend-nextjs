"use client";

import { FormEvent, useRef } from "react";

import { EmailBox } from "./Form/EmailBox";
import { JobTypeBox } from "./Form/JobTypeBox";
import { MessageBox } from "./Form/MessageBox";
import { AttachmentBox } from "./Form/AttachmentBox";
import { Submit } from "./Form/Submit";

import { logger } from "@/lib/logger";
import useChatPanel from "@/state/slices/chatPanel/hooks";

export default function ChatBox() {
  const { closeChatPanel, context } = useChatPanel();
  const formStartRef = useRef(Date.now());

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
    <form id="chatbox__form" className="chatbox__form" onSubmit={handleSubmit}>
      <input
        type="hidden"
        name="projectName"
        value={context?.projectName ?? ""}
      />
      <input type="hidden" name="source" value={context?.source ?? ""} />
      <input type="hidden" name="formStart" value={formStartRef.current} />
      <input
        type="text"
        name="honeypot"
        className="chatbox__honeypot"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <EmailBox />

      <JobTypeBox />

      <MessageBox />

      <AttachmentBox />

      <Submit text="Send Message" />
    </form>
  );
}
