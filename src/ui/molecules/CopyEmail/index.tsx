"use client";

import "./styles.css";

import { useEffect, useState } from "react";
import Skeleton from "./skeleton";
import EmailLink from "./EmailLink";
import CopyButton from "@/buttons/CopyButton";

/**
 * CopyEmail - Composite component with email link and copy button
 * Uses Suspense for async EmailLink loading
 */
const CopyEmail = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <span className="copy-email__container">
        <Skeleton />
      </span>
    );
  }

  return (
    <span className="copy-email__container">
      <EmailLink />
      <CopyButton />
    </span>
  );
};

export default CopyEmail;
