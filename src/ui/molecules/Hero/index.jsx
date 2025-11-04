"use client";

import "./styles.css";

import { Suspense } from "react";
import { ImageLinkSkeleton as HeroLinkSkeleton } from "@/atoms/links/ImageLink/skeleton";

import { ImageLink } from "@/atoms/links";
import { useProfile } from "@/domains/profile/queries";

const Hero = ({ name, size, className }) => {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useProfile(1); // Pass ID

  if (isLoadingProfile) {
    return <HeroLinkSkeleton className={`hero-image ${className}`} />;
  }

  if (isErrorProfile || !profile) {
    return <div>Error loading profile</div>;
  }

  return (
    <ImageLink
      href={profile.calendly || "#"}
      src={profile.avatar?.url || "/images/profile/hero.png"}
      alt={name || profile.nickname}
      size={size}
      className={className}
    />
  );
};

export default Hero;
