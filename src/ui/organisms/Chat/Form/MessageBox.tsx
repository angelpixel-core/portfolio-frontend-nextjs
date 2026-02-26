"use client";

import { useState, ChangeEvent } from "react";

interface MessageBoxProps {
  limit?: number;
}

export function MessageBox({ limit = 4500 }: MessageBoxProps) {
  const [, setMessage] = useState("");
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(event.target.value);

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
        className="form-message__input"
      />
    </div>
  );
}
