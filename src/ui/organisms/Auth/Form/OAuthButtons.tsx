"use client";

import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

interface OAuthButtonsProps {
  onOAuthClick?: (_provider: string) => void;
}

const OAuthButtons = ({ onOAuthClick }: OAuthButtonsProps) => {
  const handleClick = (provider: string) => {
    onOAuthClick?.(provider);
  };

  return (
    <div className="auth-oauth-buttons">
      <button
        type="button"
        className="auth-oauth-button"
        onClick={() => handleClick("linkedin")}
        aria-label="Continue with LinkedIn"
      >
        <LinkedInIcon className="h-5 w-5" />
        <span>Continue with LinkedIn</span>
      </button>

      <button
        type="button"
        className="auth-oauth-button"
        onClick={() => handleClick("microsoft")}
        aria-label="Continue with Microsoft"
      >
        <MicrosoftIcon className="h-5 w-5" />
        <span>Continue with Microsoft</span>
      </button>

      <button
        type="button"
        className="auth-oauth-button"
        onClick={() => handleClick("google")}
        aria-label="Continue with Google"
      >
        <GooglePlusIcon className="h-5 w-5" />
        <span>Continue with Google</span>
      </button>
    </div>
  );
};

export default OAuthButtons;
