import "./styles.css";

import Link from "next/link";
import EnvelopeIcon from "@/atoms/icons/EnvelopeIcon";
import { logger } from "@/lib/logger";

const email = process.env.PROFILE_EMAIL;

if (!email) {
  logger.warn("Email", "PROFILE_EMAIL environment variable not set");
}

/**
 * EmailLink - Server Component that renders a mailto: link
 * Email is server-side rendered for SEO and accessibility
 */
const EmailLink = () => {
  if (!email) {
    return null;
  }

  return (
    <Link
      id="emailTextId"
      href={`mailto:${email}`}
      className="email__link"
      aria-label={`Send email to ${email}`}
      data-testid="contact-email-link"
    >
      <EnvelopeIcon className="email__icon" aria-hidden="true" />
      <span>{email}</span>
    </Link>
  );
};

export default EmailLink;
