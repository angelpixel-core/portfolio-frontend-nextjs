"use client";

import "./styles.css";

import { default as NextLink } from "next/link";
import { useProfile } from "@/domains/profile/queries";

const Link = () => {
  const { data: profile, isLoading, isError } = useProfile(1);

  // Keep consistent text to avoid hydration mismatch
  const href = isLoading || isError || !profile ? "#" : profile.github || "#";
  const text =
    isLoading || isError || !profile ? "Author" : profile.brand || "Author";

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
