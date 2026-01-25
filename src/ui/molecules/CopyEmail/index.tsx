import "./styles.css";

import { Suspense } from "react";
import Skeleton from "./skeleton";
import EmailLink from "./EmailLink";

import { CopyButton } from "@/buttons";

/**
 * CopyEmail - Composite component with email link and copy button
 * Uses Suspense for async EmailLink loading
 */
const CopyEmail = () => {
  return (
    <span className="copy-email_container">
      <Suspense fallback={<Skeleton />}>
        <EmailLink />
      </Suspense>
      <CopyButton />
    </span>
  );
};

export default CopyEmail;
