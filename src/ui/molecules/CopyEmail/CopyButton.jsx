"use client";

import "./styles.css";

import { useDispatch, useSelector } from "react-redux";
import { toggleIsEmailCopied } from "@/slices/email/emailSlice";

import { CopyIcon, CheckIcon } from "@/atoms/icons/_index";

export default function CopyButton() {
  const dispatch = useDispatch();
  const { isEmailCopied } = useSelector((state) => state.email);

  const copyEmail = () => {
    const emailText = document.querySelector("#emailTextId");
    navigator.clipboard.writeText(emailText.innerText);
  };

  const setCopiedIcon = () => {
    const copyButton = document.querySelector("#emailCopyId");
    copyButton.classList.add("email_copy-button--active");

    setTimeout(() => {
      copyButton.classList.remove("email_copy-button--active");
      dispatch(toggleIsEmailCopied());
    }, 2_000);
  };

  return (
    <button
      className="email_copy-button"
      id="emailCopyId"
      onClick={() => {
        dispatch(toggleIsEmailCopied());
        copyEmail();
        setCopiedIcon();
      }}
    >
      {isEmailCopied ? (
        <CheckIcon className="email_copy-icon" />
      ) : (
        <CopyIcon className="email_copy-icon" />
      )}
    </button>
  );
}
