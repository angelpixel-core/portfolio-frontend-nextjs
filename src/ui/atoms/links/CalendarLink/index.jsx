import "./styles.css";

import Link from "next/link";
import { CalendarIcon } from "@/icons";

// TODO: async ??
const CalendarLink = ({ href, text, target = "_blank", className = "" }) => {
  return (
    <span className="calendar-container">
      <Link
        href={href}
        target={target}
        className={`calendar_link ${className}`}
        suppressHydrationWarning
      >
        {text}
      </Link>

      <Link 
        href={href} 
        target={target} 
        className="calendar_icon-container"
        suppressHydrationWarning
      >
        <CalendarIcon className="calendar_icon" />
      </Link>
    </span>
  );
};

export default CalendarLink;
