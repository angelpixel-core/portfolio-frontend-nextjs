"use client";

import { CalendarLink } from "@/links";
import { useProfile } from "@/domains/profile/queries";

const Link = ({ text, className }) => {
  const { data: profile, isLoading, isError } = useProfile(1);

  // Keep same text to avoid hydration mismatch
  // Just change href based on loading/error state
  const href = isLoading || isError || !profile ? "#" : (profile.calendly || "#");

  return <CalendarLink href={href} text={text} className={className} />;
};

export default Link;
