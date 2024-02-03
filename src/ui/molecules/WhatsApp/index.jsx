import "./styles.css";

import { Suspense } from "react";
import WhatsAppLinkSkeleton from "./skeleton";
import WhatsAppLink from "./WhatsAppLink";

export function WhatsApp() {
  return (
    <span className="whatsapp_link-container">
      <Suspense fallback={<WhatsAppLinkSkeleton />}>
        <WhatsAppLink />
      </Suspense>
    </span>
  );
}
