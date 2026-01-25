"use client";

import { useEffect, ChangeEvent } from "react";

interface EmailInputProps {
  onChange: (_event: ChangeEvent<HTMLInputElement>) => void;
}

export function EmailInput({ onChange }: EmailInputProps) {
  const handleEmailKeyUp = (event: Event) => {
    const emailRegex = /^.{1,40}@([^.\s]+\.){1}[^.\s]+(\.[^.\s]+)?$/;
    const validateEmail = (address: string) => emailRegex.test(address);

    const emailInput = event.target as HTMLInputElement;

    if (!validateEmail(emailInput.value)) {
      emailInput.classList.add("form-email_input--error");
    } else {
      emailInput.classList.remove("form-email_input--error");
    }
  };

  useEffect(() => {
    const emailInput = document.querySelector("#email");
    if (emailInput) {
      emailInput.addEventListener("keyup", handleEmailKeyUp);
      return () => emailInput.removeEventListener("keyup", handleEmailKeyUp);
    }
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
