import "./styles.css";

import Link from "next/link";
import { CalendarIcon } from "@/icons";

// TODO: async ??
const CalendarLink = ({ href, text, target = "_blank", className = "" }) => {
  const label = text || "Open calendar";

  return (
    <span className="calendar-container">
      <Link
        href={href}
        target={target}
        className={`calendar_link ${className}`}
        suppressHydrationWarning
        aria-label={label}
        title={label}
      >
        {text}
      </Link>

      <Link
        href={href}
        target={target}
        className="calendar_icon-container"
        suppressHydrationWarning
        aria-label={label}
        title={label}
      >
        <CalendarIcon className="calendar_icon" />
      </Link>
    </span>
  );
};

export default CalendarLink;
