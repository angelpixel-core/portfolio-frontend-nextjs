"use client";

import { useMemo, useState, ChangeEvent } from "react";

interface ContactStepProps {
  value?: string;
  onChange: (_value: string) => void;
  showError: boolean;
}

const ContactStep = ({ value, onChange, showError }: ContactStepProps) => {
  const [touched, setTouched] = useState(false);
  const emailRegex = useMemo(
    () => /^.{1,40}@([^.\s]+\.){1}[^.\s]+(\.[^.\s]+)?$/,
    []
  );

  const trimmedValue = value?.trim() ?? "";
  const isValid = trimmedValue.length > 0 && emailRegex.test(trimmedValue);
  const shouldShowError = (touched || showError) && !isValid;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="hire-flow-step">
      <div className="hire-flow-field">
        <label className="hire-flow-field__label" htmlFor="hire-flow-email">
          Email address
        </label>
        <input
          id="hire-flow-email"
          type="email"
          name="hireFlowEmail"
          value={value ?? ""}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="you@example.com"
          maxLength={254}
          required
          aria-invalid={shouldShowError}
          aria-describedby={
            shouldShowError ? "hire-flow-email-error" : undefined
          }
          className={`hire-flow-field__input ${
            shouldShowError ? "hire-flow-field__input--error" : ""
          }`}
        />
        {shouldShowError ? (
          <span className="hire-flow-error" id="hire-flow-email-error">
            Please enter a valid email.
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ContactStep;
