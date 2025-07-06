"use client";

import { useState } from "react";

export function MessageBox({ limit = 4500 }) {
  const [, setMessage] = useState("");
  const handleChange = (event) => setMessage(event.target.value);

  return (
    <div className="form-message">
      <label className="form-message_label" htmlFor="message">
        Message
      </label>
      <textarea
        id="message"
        name="message"
        rows="4"
        required
        maxLength={limit}
        onChange={handleChange}
        className="form-message_input"
      />
    </div>
  );
}
