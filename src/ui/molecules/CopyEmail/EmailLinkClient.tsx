"use client";

import Link from "next/link";
import EnvelopeIcon from "@/atoms/icons/EnvelopeIcon";
import { trackEvent } from "@/services/analytics";

interface EmailLinkClientProps {
  email: string;
}

const EmailLinkClient = ({ email }: EmailLinkClientProps) => {
  const href = `mailto:${email}`;

  const handleClick = () => {
    trackEvent("cta_contact_click", { label: "email", href });
  };

  return (
    <Link
      id="emailTextId"
      href={href}
      className="email__link"
      aria-label={`Send email to ${email}`}
      data-testid="contact-email-link"
      onClick={handleClick}
    >
      <EnvelopeIcon className="email__icon" aria-hidden="true" />
      <span>{email}</span>
    </Link>
  );
};

export default EmailLinkClient;
