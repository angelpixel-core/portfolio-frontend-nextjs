"use client";

import "./styles.css";
import useEmailClipboard from "@/state/slices/EmailClipboard/hooks";
import CopyIcon from "@/atoms/icons/CopyIcon";
import CheckIcon from "@/atoms/icons/CheckIcon";

const ERROR_MESSAGE = "Unable to copy. Please select and copy manually.";
const COPY_FEEDBACK_DURATION = 2000;
const ERROR_DISPLAY_DURATION = 3000;
const DEFAULT_TARGET_ID = "emailTextId";

interface CopyButtonProps {
  copyText?: string;
  getCopyText?: () => string;
  targetId?: string;
  ariaLabel?: string;
}

/**
 * CopyButton - Copies email address to clipboard
 * Uses Redux state to show copy confirmation feedback and error handling
 */
const CopyButton = ({
  copyText,
  getCopyText,
  targetId = DEFAULT_TARGET_ID,
  ariaLabel = "Copy email address to clipboard",
}: CopyButtonProps) => {
  const {
    isCopied,
    error,
    markEmailClipboard,
    resetEmailClipboard,
    setClipboardError,
    clearClipboardError,
  } = useEmailClipboard();

  const fallbackCopyToClipboard = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const resolveCopyText = () => {
    if (typeof copyText === "string") return copyText;
    if (getCopyText) return getCopyText();
    const el = document.getElementById(targetId);
    return el?.innerText ?? "";
  };

  const handleCopy = async () => {
    const text = resolveCopyText();
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopyToClipboard(text);
      }
      markEmailClipboard();
      setTimeout(resetEmailClipboard, COPY_FEEDBACK_DURATION);
    } catch {
      try {
        fallbackCopyToClipboard(text);
        markEmailClipboard();
        setTimeout(resetEmailClipboard, COPY_FEEDBACK_DURATION);
      } catch {
        setClipboardError(ERROR_MESSAGE);
        setTimeout(clearClipboardError, ERROR_DISPLAY_DURATION);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className={`email__copy-button focus-ring ${isCopied ? "email__copy-button--active" : ""}`}
        onClick={handleCopy}
        aria-label={ariaLabel}
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
