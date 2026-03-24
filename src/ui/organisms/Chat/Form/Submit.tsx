"use client";

import { useState, useEffect, MouseEvent, type Ref } from "react";

type SubmitState = "idle" | "sending" | "success";

interface SubmitProps {
  text: string;
  /** Simulate sending delay in ms (for demo) */
  simulateDelay?: number;
  /** Callback when form should actually submit */
  onSubmit?: () => Promise<boolean>;
  /** Callback after successful submission */
  onSuccess?: () => void;
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
  simulateDelay = 2500,
  onSubmit,
  onSuccess,
  buttonRef,
}: SubmitProps) {
  const [state, setState] = useState<SubmitState>("idle");
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

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    if (state !== "idle") {
      e.preventDefault();
      return;
    }

    setState("sending");

    // Simulate or actual submit
    if (onSubmit) {
      const success = await onSubmit();
      if (success) {
        setState("success");
        onSuccess?.();
        setTimeout(() => setState("idle"), 2000);
      } else {
        setState("idle");
      }
    } else {
      // Demo mode: simulate delay
      await new Promise((resolve) => setTimeout(resolve, simulateDelay));
      setState("success");
      setTimeout(() => setState("idle"), 2000);
    }
  };

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
        type={state === "idle" && !onSubmit ? "submit" : "button"}
        onClick={handleClick}
        disabled={state === "success"}
        data-testid="chat-send-button"
        ref={buttonRef}
      >
        {renderContent()}
      </button>
    </div>
  );
}
