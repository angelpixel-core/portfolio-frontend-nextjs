import { default as Link } from "./Link";

import { Suspense } from "react";
import Skeleton from "@/links/CalendarLink/skeleton";

const Calendar = ({ className }) => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Link text="contact" className={className} />
    </Suspense>
  );
};

export default Calendar;
