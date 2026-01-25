import "./styles.css";

import { Suspense } from "react";
import { default as Skeleton } from "./Skeleton";
import { default as Link } from "./Link";

/**
 * WhatsApp - Contact via WhatsApp component
 * Story 5.2: WhatsApp Contact
 */
const WhatsApp = () => {
  return (
    <span className="whatsapp_link-container">
      <Suspense fallback={<Skeleton />}>
        <Link />
      </Suspense>
    </span>
  );
};

export default WhatsApp;
