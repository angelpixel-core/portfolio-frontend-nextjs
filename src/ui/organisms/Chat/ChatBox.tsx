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

const getSubmitErrorMessage = (errorCode: string | undefined): string => {
  switch (errorCode) {
    case "recaptcha_browser_error":
      return "reCAPTCHA was blocked by your browser. Disable tracking protection/extensions for this site and try again.";
    case "recaptcha_invalid":
    case "recaptcha_failed":
      return "reCAPTCHA verification failed. Please reload and try again.";
    case "rate_limited":
      return "Too many attempts. Please wait a minute before trying again.";
    default:
      return "Unable to send message. Please try again.";
  }
};

type SubmitResult = {
  ok: boolean;
  errorCode?: string;
};

export default function ChatBox() {
  const { context } = useChatPanel();
  const formStartRef = useRef(Date.now());
  const [formKey, setFormKey] = useState(0);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (): Promise<SubmitResult> => {
    if (!formRef.current) return { ok: false };

    const formData = new FormData(formRef.current);
    try {
      const token = await getRecaptchaToken("chat_submit");
      formData.set("recaptchaToken", token);
      formData.set("recaptchaAction", "chat_submit");
    } catch (error) {
      logger.error("Chat", "Failed to verify recaptcha", error);
      return { ok: false, errorCode: "recaptcha_browser_error" };
    }

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => null);

      if (response.ok && payload?.ok !== false) {
        logger.debug("Chat", "Form submitted successfully");
        return { ok: true };
      }

      if (payload?.error) {
        logger.error("Chat", "Server returned error", payload.error);
      }

      return { ok: false, errorCode: payload?.error };
    } catch (error) {
      logger.error("Chat", "Failed to submit form", error);
      return { ok: false };
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

    const result = await handleSubmit();

    if (result.ok) {
      setSubmitState("success");
      handleSubmitSuccess();
      setTimeout(() => setSubmitState("idle"), 2000);
      return;
    }

    setSubmitState("idle");
    setSubmitError(getSubmitErrorMessage(result.errorCode));
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
