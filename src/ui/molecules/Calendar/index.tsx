import { Suspense } from "react";

import "@/links/CalendarLink/styles.css";
import { default as Link } from "./Link";
import Skeleton from "@/links/CalendarLink/skeleton";

interface CalendarProps {
  className?: string;
}

const Calendar = ({ className }: CalendarProps) => {
  return (
    <div className="calendar-wrapper">
      <Suspense fallback={<Skeleton className={className} />}>
        <Link className={className} />
      </Suspense>
    </div>
  );
};

export default Calendar;
