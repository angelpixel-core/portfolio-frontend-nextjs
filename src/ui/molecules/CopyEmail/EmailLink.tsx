import "./styles.css";

import Link from "next/link";
import { logger } from "@/lib/logger";

const email = process.env.PROFILE_EMAIL;

/**
 * EmailLink - Server Component that renders a mailto: link
 * Email is server-side rendered for SEO and accessibility
 */
const EmailLink = () => {
  // Fallback if env var not set
  if (!email) {
    logger.warn("Email", "PROFILE_EMAIL environment variable not set");
    return null;
  }

  return (
    <Link
      id="emailTextId"
      href={`mailto:${email}`}
      className="email_link"
      aria-label={`Send email to ${email}`}
      data-testid="contact-email-link"
    >
      {email}
    </Link>
  );
};

export default EmailLink;
