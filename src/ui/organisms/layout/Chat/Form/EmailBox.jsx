import { useState } from "react";

import { LinkedInIcon, MicrosoftIcon } from "@/atoms/icons";
import { EmailInput } from "./EmailInput";

export function EmailBox() {
  const [, setEmail] = useState("");
  const handleChange = (event) => setEmail(event.target.value);

  return (
    <div className="form-email_container">
      <EmailInput onChange={handleChange} />

      <div className="form-social">
        <div className="social_icon-container bg-light/90">
          <MicrosoftIcon />
        </div>
        <div className="social_icon-container bg-primaryDarkLinkedIn/90">
          <LinkedInIcon />
        </div>
      </div>
    </div>
  );
}
