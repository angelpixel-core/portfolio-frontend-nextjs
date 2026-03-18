"use client";

import "./styles.css";

import Link from "next/link";
import CalendlyIcon from "@/atoms/icons/CalendlyIcon";
import { trackEvent } from "@/services/analytics";

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
  const handleClick = () => {
    trackEvent("cta_book_call_click", {
      label: "book a call",
      href,
    });
  };

  return (
    <Link
      href={href}
      target={target}
      rel="noopener noreferrer"
      className={`calendar__link ${className}`}
      style={{ color: "var(--calendar-text-color)" }}
      aria-label="Contact - Schedule a meeting via Calendly"
      data-testid="contact-calendly-link"
      onClick={handleClick}
    >
      <CalendlyIcon className="calendar__icon" />
      <span className="calendar__text" aria-hidden="true">
        book a call
      </span>
    </Link>
  );
};

export default CalendarLink;
