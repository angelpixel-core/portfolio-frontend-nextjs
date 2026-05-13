"use client";

import { useState, ChangeEvent } from "react";

import SocialAuthDropdown from "@/molecules/SocialAuthDropdown";
import { EmailInput } from "./EmailInput";
import type { OAuthProvider } from "@/application/auth/types";

interface EmailBoxProps {
  disabledProviders?: OAuthProvider[];
}

export function EmailBox({ disabledProviders }: EmailBoxProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const handleSocialSelect = (fetchedEmail: string) => {
    setEmail(fetchedEmail);
    setIsLoading(false);
  };

  const handleSocialClear = () => {
    setEmail("");
  };

  return (
    <div className="form-email__container">
      <EmailInput
        value={email}
        onChange={handleChange}
        isLoading={isLoading}
        placeholder="Enter your email"
      />

      <SocialAuthDropdown
        onEmailFetched={handleSocialSelect}
        onEmailCleared={handleSocialClear}
        disabledProviders={disabledProviders}
      />
    </div>
  );
}
