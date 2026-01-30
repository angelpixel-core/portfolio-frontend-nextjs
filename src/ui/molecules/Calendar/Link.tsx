"use client";

import { CalendarLink } from "@/links";
import { useProfile } from "@/domains/profile/queries";
import { logger } from "@/lib/logger";

interface LinkProps {
  text?: string;
  className?: string;
}

/**
 * CalendarLinkSkeleton - Reserves space for Contact button during loading
 * Prevents layout shift when the actual link renders
 */
const CalendarLinkSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <span className="calendar-container">
      <span
        className={`calendar_link calendar_link--skeleton ${className}`}
        aria-hidden="true"
      >
        Contact
      </span>
      <span className="calendar_icon-container calendar_icon-container--skeleton">
        <span className="calendar_icon--skeleton" />
      </span>
    </span>
  );
};

const Link = ({ text, className }: LinkProps) => {
  const { data: profile, isLoading, isError } = useProfile(1);

  // During loading: show skeleton to reserve space (prevents layout shift)
  if (isLoading) {
    return <CalendarLinkSkeleton className={className} />;
  }

  // Error or no calendly URL: return null (graceful degradation)
  if (isError || !profile?.calendly) {
    if (!profile?.calendly) {
      logger.warn("Calendar", "Calendly URL not available in profile", {
        isError,
        hasProfile: !!profile,
      });
    }
    return null;
  }

  return (
    <CalendarLink href={profile.calendly} text={text} className={className} />
  );
};

export default Link;
