"use client";

import React from "react";

import "./styles.css";

import { default as NextLink } from "next/link";
import { useProfile } from "@/domains/profile/queries";

const Link = (): React.JSX.Element => {
  const { data: profile, isLoading, isError } = useProfile(1);

  // Keep consistent text to avoid hydration mismatch
  const href = isLoading || isError || !profile ? "#" : profile.linkedin || "#";
  const text =
    isLoading || isError || !profile
      ? "Author"
      : profile.authorName || "Author";

  return (
    <NextLink
      href={href}
      target="_blank"
      className="author-link"
      suppressHydrationWarning
    >
      {text}
    </NextLink>
  );
};

export default Link;
