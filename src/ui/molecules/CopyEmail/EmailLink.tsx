import "./styles.css";

import { logger } from "@/lib/logger";
import EmailLinkClient from "./EmailLinkClient";

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

  return <EmailLinkClient email={email} />;
};

export default EmailLink;
