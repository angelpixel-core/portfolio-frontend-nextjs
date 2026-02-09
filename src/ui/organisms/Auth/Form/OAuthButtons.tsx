"use client";

import LinkedInIcon from "@/atoms/icons/LinkedInIcon";
import MicrosoftIcon from "@/atoms/icons/MicrosoftIcon";
import GooglePlusIcon from "@/atoms/icons/GooglePlusIcon";
import type { OAuthProvider } from "@/services/auth";

interface OAuthButtonsProps {
  onOAuthClick?: (_provider: OAuthProvider) => void;
  disabled?: boolean;
}

/**
 * OAuthButtons - Row of OAuth provider icons for Auth modal
 *
 * Shows LinkedIn, Microsoft, Google icons directly in a row.
 * Used in signin/signup forms for social authentication.
 */
const OAuthButtons = ({ onOAuthClick, disabled }: OAuthButtonsProps) => {
  const handleClick = (provider: OAuthProvider) => {
    onOAuthClick?.(provider);
  };

  return (
    <div className="auth-oauth-row">
      <button
        type="button"
        data-testid="auth-oauth-linkedin"
        className="auth-oauth-btn auth-oauth-btn--linkedin"
        onClick={() => handleClick("linkedin")}
        aria-label="Continue with LinkedIn"
        disabled={disabled}
      >
        <LinkedInIcon className="h-5 w-5" colored />
      </button>

      <button
        type="button"
        data-testid="auth-oauth-microsoft"
        className="auth-oauth-btn auth-oauth-btn--microsoft"
        onClick={() => handleClick("microsoft")}
        aria-label="Continue with Microsoft"
        disabled={disabled}
      >
        <MicrosoftIcon className="h-5 w-5" />
      </button>

      <button
        type="button"
        data-testid="auth-oauth-google"
        className="auth-oauth-btn auth-oauth-btn--google"
        onClick={() => handleClick("google")}
        aria-label="Continue with Google"
        disabled={disabled}
      >
        <GooglePlusIcon className="h-5 w-5" colored />
      </button>
    </div>
  );
};

export default OAuthButtons;
