"use client";

import { useEffect } from "react";

export function EmailInput({ onChange }) {
  const handleEmailKeyUp = (event) => {
    const emailRegex = /^.{1,40}@([^.\s]+\.){1}[^.\s]+(\.[^.\s]+)?$/;
    const validateEmail = (address) => emailRegex.test(address);

    let emailInput = event.target;

    if (!validateEmail(emailInput.value)) {
      emailInput.classList.add("form-email_input--error");
    } else {
      emailInput.classList.remove("form-email_input--error");
    }
  };

  useEffect(() => {
    const emailInput = document.querySelector("#email");
    emailInput.addEventListener("keyup", handleEmailKeyUp);

    return () => emailInput.removeEventListener("keyup", handleEmailKeyUp);
  }, []);

  return (
    <div className="form-email">
      <label className="form-email_label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        name="email"
        required
        onChange={onChange}
        className="form-email_input"
      />
    </div>
  );
}
