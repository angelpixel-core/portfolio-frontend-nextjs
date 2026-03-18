"use client";

import React, { useEffect, useState } from "react";
import { ArrowButton } from "@/atoms/buttons";
import { useProfile } from "@/domains/profile/queries";
import Skeleton from "@/buttons/ArrowButton/skeleton";
import { trackEvent } from "@/services/analytics";

const Button = (): React.JSX.Element => {
  const [isHydrated, setIsHydrated] = useState(false);
  const { data: profile, isLoading, isError } = useProfile(1);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated || isLoading) {
    return <Skeleton />;
  }

  if (isError || !profile) {
    return <Skeleton />;
  }

  const resumeHref = profile.resume || "#";

  const handleResumeClick = () => {
    trackEvent("cta_resume_click", { label: "resume", href: resumeHref });
  };

  return (
    <ArrowButton text="resume" href={resumeHref} onClick={handleResumeClick} />
  );
};

export default Button;
