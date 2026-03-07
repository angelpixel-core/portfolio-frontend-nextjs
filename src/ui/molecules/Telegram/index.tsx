import "./styles.css";

import { Suspense } from "react";
import { default as Skeleton } from "./skeleton";
import { default as Link } from "./Link";

/**
 * Telegram - Contact via Telegram component
 * Story 5.2: Telegram Contact
 */
const Telegram = ({ text = "telegram" }) => {
  return (
    <span className="telegram__link-container telegram__link">
      <Suspense fallback={<Skeleton />}>
        <Link text={text} />
      </Suspense>
    </span>
  );
};

export default Telegram;
