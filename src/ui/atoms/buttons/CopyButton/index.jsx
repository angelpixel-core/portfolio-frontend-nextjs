"use client";

import "./styles.css";
import { useEmailCopy } from "@/state/slices/emailCopy";
import { CopyIcon, CheckIcon } from "@/icons";

const CopyButton = () => {
  const { copied, markCopied, resetCopied } = useEmailCopy();

  const handleCopy = () => {
    const el = document.getElementById("emailTextId");
    if (!el) return;

    navigator.clipboard.writeText(el.innerText).then(() => {
      markCopied();
      setTimeout(resetCopied, 2000);
    });
  };

  return (
    <button
      className={`email_copy-button ${copied ? "email_copy-button--active" : ""}`}
      id="emailTextId"
      onClick={handleCopy}
    >
      {copied ? (
        <CheckIcon className="email_copy-icon" />
      ) : (
        <CopyIcon className="email_copy-icon" />
      )}
    </button>
  );
};

export default CopyButton;
