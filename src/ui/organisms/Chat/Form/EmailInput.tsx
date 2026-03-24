"use client";

import { useMemo, useState, ChangeEvent } from "react";

interface EmailInputProps {
  value?: string;
  onChange: (_event: ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function EmailInput({
  value,
  onChange,
  isLoading = false,
  placeholder = "",
}: EmailInputProps) {
  const [touched, setTouched] = useState(false);
  const emailRegex = useMemo(
    () => /^.{1,40}@([^.\s]+\.){1}[^.\s]+(\.[^.\s]+)?$/,
    []
  );
  const trimmedValue = value?.trim() ?? "";
  const isValid = trimmedValue.length === 0 || emailRegex.test(trimmedValue);
  const showError = touched && trimmedValue.length > 0 && !isValid;

  return (
    <div className="form-email">
      <label className="form-email__label" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        name="email"
        required
        value={value}
        onChange={onChange}
        onBlur={() => setTouched(true)}
        placeholder={placeholder}
        disabled={isLoading}
        maxLength={254}
        aria-invalid={showError}
        aria-describedby={showError ? "email-error" : undefined}
        className={`form-email__input ${
          isLoading ? "form-email__input--loading" : ""
        } ${showError ? "form-email__input--error" : ""}`}
      />
      {showError ? (
        <span className="form-email__error" id="email-error">
          Invalid email format
        </span>
      ) : null}
    </div>
  );
}
