import "./styles.css";

import { Suspense } from "react";
import { default as Skeleton } from "./Skeleton";
import { default as Link } from "./Link";

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
