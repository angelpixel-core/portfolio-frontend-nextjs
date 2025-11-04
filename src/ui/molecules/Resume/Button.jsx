"use client";

import { ArrowButton } from "@/atoms/buttons";
import { useProfile } from "@/domains/profile/queries";

const Button = () => {
  const { data: profile, isLoading, isError } = useProfile(1);

  if (isLoading) {
    return <ArrowButton text="resume" href="#" />;
  }

  if (isError || !profile) {
    return <ArrowButton text="resume" href="#" />;
  }

  return <ArrowButton text="resume" href={profile.resume || "#"} />;
};

export default Button;
