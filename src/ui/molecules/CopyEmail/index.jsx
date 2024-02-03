import "./styles.css";

import { Suspense } from "react";
import EmailLinkSkeleton from "./skeleton";
import EmailLink from "./EmailLink";
import CopyButton from "./CopyButton";

export function CopyEmail() {
  return (
    <span className="copy-email_container">
      <Suspense fallback={<EmailLinkSkeleton />}>
        <EmailLink />
      </Suspense>
      <CopyButton />
    </span>
  );
}
