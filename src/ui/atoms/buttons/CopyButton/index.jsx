"use client";

import "./styles.css";
import { useEmailClipboard } from "@/state/slices";
import { CopyIcon, CheckIcon } from "@/icons";

const CopyButton = () => {
  const { isCopied, markEmailClipboard, resetEmailClipboard } =
    useEmailClipboard();

  const handleCopy = () => {
    const el = document.getElementById("emailTextId");
    if (!el) return;

    navigator.clipboard.writeText(el.innerText).then(() => {
      markEmailClipboard();
      setTimeout(resetEmailClipboard, 2000);
    });
  };

  return (
    <button
      className={`email_copy-button ${isCopied ? "email_copy-button--active" : ""}`}
      onClick={handleCopy}
    >
      {isCopied ? (
        <CheckIcon className="email_copy-icon" />
      ) : (
        <CopyIcon className="email_copy-icon" />
      )}
    </button>
  );
};

export default CopyButton;
