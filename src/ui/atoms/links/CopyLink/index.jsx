"use client";

import "./styles.css";

import Link from "next/link";
import Script from "next/script";
import { CopyIcon, CheckIcon } from "@/atoms/icons/_index";

import { useDispatch, useSelector } from "react-redux";
import { toggleIsCopied } from "@/slices/email/emailSlice";

export const CopyLink = ({ href, target = "_blank", text, className = "" }) => {
  const dispatch = useDispatch();
  const { isCopied } = useSelector((state) => state.email);

  return (
    <span className="copy-link_container">
      <Link
        id="emailTextId"
        href={href}
        target={target}
        className={`copy-link ${className}`}
      >
        {text}
      </Link>

      <button
        className="copy-link_icon-container"
        id="emailCopyId"
        onClick={() => {
          dispatch(toggleIsCopied());
          const copyButton = document.querySelector("#emailCopyId");
          copyButton.classList.add("active");

          setTimeout(() => {
            copyButton.classList.remove("active");
            dispatch(toggleIsCopied());
          }, 2_000);
        }}
      >
        {isCopied ? (
          <CheckIcon className="copy-link_icon" />
        ) : (
          <CopyIcon className="copy-link_icon" />
        )}
      </button>

      <Script id="emailTextIdScript">
        {`
          const emailCopy = document.querySelector("#emailCopyId");
          const emailText = document.querySelector("#emailTextId");

          emailCopy.addEventListener('click', () => {
            navigator.clipboard.writeText(emailText.innerText);
          });
       `}
      </Script>
    </span>
  );
};
