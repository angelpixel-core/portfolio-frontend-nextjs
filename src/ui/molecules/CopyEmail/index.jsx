import "./styles.css";

import { Suspense } from "react";
import { default as Skeleton } from "./skeleton";
import EmailLink from "./EmailLink";

import { CopyButton } from "@/buttons";

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
