"use client";

import { useState, useRef, useEffect } from "react";
import {
  LinkedInIcon,
  MicrosoftIcon,
  GooglePlusIcon,
  EnvelopeIcon,
} from "@/icons";

interface OAuthButtonsProps {
  onOAuthClick?: (_provider: string) => void;
}

const OAuthButtons = ({ onOAuthClick }: OAuthButtonsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClick = (provider: string) => {
    onOAuthClick?.(provider);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="auth-oauth-container" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className="auth-oauth-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sign in with social account"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <EnvelopeIcon className="h-5 w-5" />
      </button>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="auth-oauth-dropdown" role="menu">
          <button
            type="button"
            className="auth-oauth-item"
            onClick={() => handleClick("linkedin")}
            aria-label="Continue with LinkedIn"
            role="menuitem"
          >
            <LinkedInIcon className="h-5 w-5" />
            <span>LinkedIn</span>
          </button>

          <button
            type="button"
            className="auth-oauth-item"
            onClick={() => handleClick("microsoft")}
            aria-label="Continue with Microsoft"
            role="menuitem"
          >
            <MicrosoftIcon className="h-5 w-5" />
            <span>Microsoft</span>
          </button>

          <button
            type="button"
            className="auth-oauth-item"
            onClick={() => handleClick("google")}
            aria-label="Continue with Google"
            role="menuitem"
          >
            <GooglePlusIcon className="h-5 w-5" />
            <span>Google</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default OAuthButtons;
