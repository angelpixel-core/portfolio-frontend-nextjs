"use client";

import { useState, ChangeEvent, KeyboardEvent } from "react";

interface MessageBoxProps {
  limit?: number;
}

export function MessageBox({ limit = 4500 }: MessageBoxProps) {
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(event.target.value);
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Ctrl/Cmd+Enter to preserve multiline entry on Enter.
    if (event.key !== "Enter") return;
    if (!event.metaKey && !event.ctrlKey) return;

    event.preventDefault();

    const form = event.currentTarget.form;
    if (!form) return;

    if (typeof form.requestSubmit === "function") {
      form.requestSubmit();
      return;
    }

    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  };
  const atLimit = message.length >= limit;
  const showError = touched && atLimit;

  return (
    <div className="form-message">
      <label className="form-message__label" htmlFor="message">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        rows={4}
        required
        maxLength={limit}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        onKeyDown={handleKeyDown}
        aria-invalid={showError}
        aria-describedby={showError ? "message-error" : undefined}
        className={`form-message__input ${
          showError ? "form-message__input--error" : ""
        }`}
      />
      {showError ? (
        <span className="form-message__error" id="message-error">
          Max length reached ({limit} chars)
        </span>
      ) : null}
    </div>
  );
}
