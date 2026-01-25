"use client";

import { CalendarLink } from "@/links";
import { useProfile } from "@/domains/profile/queries";
import { logger } from "@/lib/logger";

interface LinkProps {
  text?: string;
  className?: string;
}

const Link = ({ text, className }: LinkProps) => {
  const { data: profile, isLoading, isError } = useProfile(1);

  // Graceful fallback: return null when data not available
  if (isLoading || isError || !profile?.calendly) {
    if (!isLoading && !profile?.calendly) {
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
