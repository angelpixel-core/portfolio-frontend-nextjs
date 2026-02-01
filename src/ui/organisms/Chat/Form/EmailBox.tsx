import { useState, ChangeEvent } from "react";

import { SocialAuthDropdown } from "@/molecules";
import { EmailInput } from "./EmailInput";

export function EmailBox() {
  const [, setEmail] = useState("");
  const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
    setEmail(event.target.value);

  const handleSocialSelect = (provider: string) => {
    // TODO: Implement social auth flow
    console.log("Social auth selected:", provider);
  };

  return (
    <div className="form-email_container">
      <EmailInput onChange={handleChange} />

      <SocialAuthDropdown onSelect={handleSocialSelect} />
    </div>
  );
}
