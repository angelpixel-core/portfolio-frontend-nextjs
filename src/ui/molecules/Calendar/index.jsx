import { Link } from "./Link";

import { Suspense } from "react";
import Skeleton from "@/atoms/links/CalendarLink/skeleton";

export function Calendar({ className }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <Link text="contact" className={className} />
    </Suspense>
  );
}
