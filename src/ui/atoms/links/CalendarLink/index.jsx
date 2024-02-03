import "./styles.css";

import Link from "next/link";
import { CalendarIcon } from "@/atoms/icons/_index";

export function CalendarLink({ href, target, text, className = "" }) {
  return (
    <span className="calendar_container">
      <Link
        href={href}
        target={target}
        className={`calendar_link ${className}`}
      >
        {text}
      </Link>

      <Link href={href} target={target} className="calendar_icon-container">
        <CalendarIcon className="calendar_icon" />
      </Link>
    </span>
  );
}
