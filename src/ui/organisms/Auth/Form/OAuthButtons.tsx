"use client";

import { LinkedInIcon, MicrosoftIcon, GooglePlusIcon } from "@/icons";

interface OAuthButtonsProps {
  onOAuthClick?: (_provider: string) => void;
}

/**
 * OAuthButtons - Row of OAuth provider icons for Auth modal
 *
 * Shows LinkedIn, Microsoft, Google icons directly in a row.
 * Used in signin/signup forms for social authentication.
 */
const OAuthButtons = ({ onOAuthClick }: OAuthButtonsProps) => {
  const handleClick = (provider: string) => {
    onOAuthClick?.(provider);
  };

  return (
    <div className="auth-oauth-row">
      <button
        type="button"
        className="auth-oauth-btn auth-oauth-btn--linkedin"
        onClick={() => handleClick("linkedin")}
        aria-label="Continue with LinkedIn"
      >
        <LinkedInIcon className="h-5 w-5" colored />
      </button>

      <button
        type="button"
        className="auth-oauth-btn auth-oauth-btn--microsoft"
        onClick={() => handleClick("microsoft")}
        aria-label="Continue with Microsoft"
      >
        <MicrosoftIcon className="h-5 w-5" />
      </button>

      <button
        type="button"
        className="auth-oauth-btn auth-oauth-btn--google"
        onClick={() => handleClick("google")}
        aria-label="Continue with Google"
      >
        <GooglePlusIcon className="h-5 w-5" colored />
      </button>
    </div>
  );
};

export default OAuthButtons;
