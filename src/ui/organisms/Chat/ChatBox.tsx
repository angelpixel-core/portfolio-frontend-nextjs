"use client";

import { FormEvent, useRef, useState } from "react";

import { EmailBox } from "./Form/EmailBox";
import { JobTypeBox } from "./Form/JobTypeBox";
import { MessageBox } from "./Form/MessageBox";
import { AttachmentBox } from "./Form/AttachmentBox";
import { Submit, type SubmitState } from "./Form/Submit";

import { logger } from "@/lib/logger";
import { getRecaptchaToken } from "@/lib/recaptcha";
import useChatPanel from "@/state/slices/chatPanel/hooks";

export default function ChatBox() {
  const { context } = useChatPanel();
  const formStartRef = useRef(Date.now());
  const [formKey, setFormKey] = useState(0);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (): Promise<boolean> => {
    if (!formRef.current) return false;

    const formData = new FormData(formRef.current);
    try {
      const token = await getRecaptchaToken("chat_submit");
      formData.set("recaptchaToken", token);
      formData.set("recaptchaAction", "chat_submit");
    } catch (error) {
      logger.error("Chat", "Failed to verify recaptcha", error);
      return false;
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => null);

      if (response.ok && payload?.ok !== false) {
        logger.debug("Chat", "Form submitted successfully");
        return true;
      }

      if (payload?.error) {
        logger.error("Chat", "Server returned error", payload.error);
      }

      return false;
    } catch (error) {
      logger.error("Chat", "Failed to submit form", error);
      return false;
    }
  };

  const handleSubmitSuccess = () => {
    formStartRef.current = Date.now();
    setJobTypes([]);
    setFormKey((current) => current + 1);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Centralized submit flow ensures click and keyboard share the same path.
    if (submitState !== "idle") return;

    setSubmitError(null);
    setSubmitState("sending");

    const success = await handleSubmit();

    if (success) {
      setSubmitState("success");
      handleSubmitSuccess();
      setTimeout(() => setSubmitState("idle"), 2000);
      return;
    }

    setSubmitState("idle");
    setSubmitError("Unable to send message. Please try again.");
  };

  const disableLinkedIn =
    context?.source === "footer" || context?.source === "project_teaser";

  return (
    <form
      key={formKey}
      id="chatbox__form"
      className="chatbox__form"
      onSubmit={handleFormSubmit}
      ref={formRef}
    >
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
      {jobTypes.map((jobType) => (
        <input key={jobType} type="hidden" name="jobTypes" value={jobType} />
      ))}
      <EmailBox disabledProviders={disableLinkedIn ? ["linkedin"] : []} />

      <JobTypeBox onChange={setJobTypes} />

      <MessageBox />

      <AttachmentBox />

      <Submit
        text="Send Message"
        state={submitState}
        disabled={submitState !== "idle"}
        errorMessage={submitError}
        shortcutLabel="Ctrl/Cmd + Enter"
      />
    </form>
  );
}
