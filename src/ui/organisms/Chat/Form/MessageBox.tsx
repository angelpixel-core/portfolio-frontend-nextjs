"use client";

import { useState, ChangeEvent } from "react";

interface MessageBoxProps {
  limit?: number;
}

export function MessageBox({ limit = 4500 }: MessageBoxProps) {
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(event.target.value);
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
