import "./styles.css";

import Link from "next/link";
import { CalendarIcon } from "@/atoms/icons/_index";

export const CalendarLink = ({ href, target, text, className = "" }) => {
  return (
    <span className="calendar-link_container">
      <Link
        href={href}
        target={target}
        className={`calendar-link ${className}`}
      >
        {text}
      </Link>

      <Link
        href={href}
        target={target}
        className="calendar-link_icon-container"
      >
        <CalendarIcon className="calendar-link_icon" />
      </Link>
    </span>
  );
};
