import "./styles.css";

import Link from "next/link";
import CalendlyIcon from "@/atoms/icons/CalendlyIcon";

interface CalendarLinkProps {
  href: string;
  target?: string;
  className?: string;
}

/**
 * CalendarLink - Calendly scheduling link
 *
 * Design: Icon replaces the "C" in "Contact"
 * Visual: [C-icon]ontact (reads as one word)
 * A11y: aria-label provides full "Contact" text for screen readers
 */
const CalendarLink = ({
  href,
  target = "_blank",
  className = "",
}: CalendarLinkProps) => {
  return (
    <Link
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={`calendar_link ${className}`}
      style={{ color: "var(--calendar-text-color)" }}
      aria-label="Contact - Schedule a meeting via Calendly"
      data-testid="contact-calendly-link"
    >
      <CalendlyIcon className="calendar_icon" />
      <span className="calendar_text" aria-hidden="true">
        ontact
      </span>
    </Link>
  );
};

export default CalendarLink;
