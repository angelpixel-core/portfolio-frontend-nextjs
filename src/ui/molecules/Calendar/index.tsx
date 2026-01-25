import { Suspense } from "react";

import { default as Link } from "./Link";
import Skeleton from "@/links/CalendarLink/skeleton";

interface CalendarProps {
  className?: string;
}

const Calendar = ({ className }: CalendarProps) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Link text="contact" className={className} />
    </Suspense>
  );
};

export default Calendar;
