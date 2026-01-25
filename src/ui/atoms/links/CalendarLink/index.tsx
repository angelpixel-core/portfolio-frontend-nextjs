import "./styles.css";

import Link from "next/link";
import { CalendarIcon } from "@/icons";

interface CalendarLinkProps {
  href: string;
  text?: string;
  target?: string;
  className?: string;
}

const CalendarLink = ({
  href,
  text,
  target = "_blank",
  className = "",
}: CalendarLinkProps) => {
  const label = "Schedule a meeting via Calendly";

  return (
    <span className="calendar-container">
      <Link
        href={href}
        target={target}
        rel="noopener noreferrer"
        className={`calendar_link ${className}`}
        aria-label={label}
      >
        {text}
      </Link>

      <Link
        href={href}
        target={target}
        rel="noopener noreferrer"
        className="calendar_icon-container"
        aria-hidden="true"
        tabIndex={-1}
      >
        <CalendarIcon className="calendar_icon" />
      </Link>
    </span>
  );
};

export default CalendarLink;
