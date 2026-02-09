"use client";

import CalendarLink from "@/links/CalendarLink";
import Skeleton from "@/links/CalendarLink/skeleton";
import { useProfile } from "@/domains/profile/queries";
import { logger } from "@/lib/logger";

interface LinkProps {
  className?: string;
}

const Link = ({ className }: LinkProps) => {
  const { data: profile, isLoading, isError } = useProfile(1);

  // During loading: show skeleton to reserve space (prevents layout shift)
  if (isLoading) {
    return <Skeleton className={className} />;
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

  return <CalendarLink href={profile.calendly} className={className} />;
};

export default Link;
