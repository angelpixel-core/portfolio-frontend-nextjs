"use client";

import "./styles.css";

import { ImageLinkSkeleton as HeroLinkSkeleton } from "@/atoms/links/ImageLink/skeleton";
import { ImageLink } from "@/atoms/links";
import { useProfile } from "@/domains/profile/queries";
import { SectionErrorBoundary } from "@/shared/ErrorBoundary";

const HeroContent = ({ name, size, className }) => {
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

const Hero = (props) => {
  return (
    <SectionErrorBoundary sectionName="Profile">
      <HeroContent {...props} />
    </SectionErrorBoundary>
  );
};

export default Hero;
