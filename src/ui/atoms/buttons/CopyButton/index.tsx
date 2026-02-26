"use client";

import "./styles.css";
import useEmailClipboard from "@/state/slices/EmailClipboard/hooks";
import CopyIcon from "@/atoms/icons/CopyIcon";
import CheckIcon from "@/atoms/icons/CheckIcon";

const ERROR_MESSAGE = "Unable to copy. Please select and copy manually.";
const COPY_FEEDBACK_DURATION = 2000;
const ERROR_DISPLAY_DURATION = 3000;

/**
 * CopyButton - Copies email address to clipboard
 * Uses Redux state to show copy confirmation feedback and error handling
 */
const CopyButton = () => {
  const {
    isCopied,
    error,
    markEmailClipboard,
    resetEmailClipboard,
    setClipboardError,
    clearClipboardError,
  } = useEmailClipboard();

  const handleCopy = async () => {
    const el = document.getElementById("emailTextId");
    if (!el) return;

    const text = el.innerText;

    try {
      await navigator.clipboard.writeText(text);
      markEmailClipboard();
      setTimeout(resetEmailClipboard, COPY_FEEDBACK_DURATION);
    } catch {
      setClipboardError(ERROR_MESSAGE);
      setTimeout(clearClipboardError, ERROR_DISPLAY_DURATION);
    }
  };

  return (
    <>
      <button
        type="button"
        className={`email__copy-button focus-ring ${isCopied ? "email__copy-button--active" : ""}`}
        onClick={handleCopy}
        aria-label="Copy email address to clipboard"
      >
        {isCopied ? (
          <CheckIcon className="email__copy-icon" aria-hidden="true" />
        ) : (
          <CopyIcon className="email__copy-icon" aria-hidden="true" />
        )}
      </button>
      {error && (
        <span className="email__copy-error" role="alert">
          {error}
        </span>
      )}
    </>
  );
};

export default CopyButton;
