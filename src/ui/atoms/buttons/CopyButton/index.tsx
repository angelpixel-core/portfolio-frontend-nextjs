"use client";

import "./styles.css";
import { useEmailClipboard } from "@/state/slices";
import { CopyIcon, CheckIcon } from "@/icons";

/**
 * CopyButton - Copies email address to clipboard
 * Uses Redux state to show copy confirmation feedback
 */
const CopyButton = () => {
  const { isCopied, markEmailClipboard, resetEmailClipboard } =
    useEmailClipboard();

  const handleCopy = async () => {
    const el = document.getElementById("emailTextId");
    if (!el) return;

    const text = el.innerText;

    try {
      await navigator.clipboard.writeText(text);
      markEmailClipboard();
      setTimeout(resetEmailClipboard, 2000);
    } catch (error) {
      // Fallback: Log error - could show toast notification here
      console.error("Failed to copy to clipboard:", error);
    }
  };

  return (
    <button
      type="button"
      className={`email_copy-button ${isCopied ? "email_copy-button--active" : ""}`}
      onClick={handleCopy}
      aria-label="Copy email address to clipboard"
    >
      {isCopied ? (
        <CheckIcon className="email_copy-icon" aria-hidden="true" />
      ) : (
        <CopyIcon className="email_copy-icon" aria-hidden="true" />
      )}
    </button>
  );
};

export default CopyButton;
