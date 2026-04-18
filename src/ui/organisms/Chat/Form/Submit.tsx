"use client";

import { useEffect, useState, type Ref } from "react";

export type SubmitState = "idle" | "sending" | "success";

interface SubmitProps {
  text: string;
  state: SubmitState;
  disabled?: boolean;
  shortcutLabel?: string;
  errorMessage?: string | null;
  /** Optional ref for submit button */
  buttonRef?: Ref<HTMLButtonElement>;
}

/**
 * Animated Submit Button
 *
 * States:
 * - idle: Shows "Send Message" text
 * - sending: Shows "Sending" with animated dots, fire glow effect
 * - success: Shows spinning circle → green checkmark
 */
export function Submit({
  text,
  state,
  disabled = false,
  shortcutLabel,
  errorMessage,
  buttonRef,
}: SubmitProps) {
  const [dots, setDots] = useState("");

  // Animate dots: . → .. → ... → (empty) → repeat
  useEffect(() => {
    if (state !== "sending") {
      setDots("");
      return;
    }

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 400);

    return () => clearInterval(interval);
  }, [state]);

  const renderContent = () => {
    switch (state) {
      case "sending":
        return (
          <span className="form-send__text form-send__text--sending">
            Sending<span className="form-send__dots">{dots}</span>
          </span>
        );
      case "success":
        return (
          <span className="form-send__icon form-send__icon--success">
            <svg
              className="form-send__check"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
        );
      default:
        return <span className="form-send__text">{text}</span>;
    }
  };

  return (
    <div className="form-send">
      <button
        className={`form-send__input form-send__input--${state}`}
        type="submit"
        disabled={disabled || state === "success"}
        data-testid="chat-send-button"
        ref={buttonRef}
      >
        {renderContent()}
      </button>
      {shortcutLabel ? (
        <span className="form-send__hint">{shortcutLabel}</span>
      ) : null}
      {errorMessage ? (
        <span className="form-send__error" role="status">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
