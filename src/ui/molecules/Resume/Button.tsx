"use client";

import React, { useEffect, useState } from "react";
import { ArrowButton } from "@/atoms/buttons";
import { useProfile } from "@/domains/profile/queries";
import Skeleton from "@/buttons/ArrowButton/skeleton";

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

  return <ArrowButton text="resume" href={profile.resume || "#"} />;
};

export default Button;
