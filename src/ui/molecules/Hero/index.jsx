"use client";

import "./styles.css";

import { ImageLinkSkeleton as HeroLinkSkeleton } from "@/atoms/links/ImageLink/skeleton";
import { ImageLink } from "@/atoms/links";
import { useProfile } from "@/domains/profile/queries";
import { SectionErrorBoundary } from "@/shared/ErrorBoundary";

const HeroContent = ({ name, size, className, imageSrc }) => {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useProfile(1); // Pass ID

  // When imageSrc is provided (e.g. about page), use it; otherwise fallback to profile
  const resolvedSrc =
    imageSrc ?? profile?.avatar?.url ?? "/images/profile/hero.png";
  const resolvedAlt = name || profile?.nickname || "Hero";
  const resolvedHref = profile?.calendly || "#";

  if (isLoadingProfile && !imageSrc) {
    return (
      <HeroLinkSkeleton className={`hero-image ${className}`} size={size} />
    );
  }

  if (!imageSrc && (isErrorProfile || !profile)) {
    return <div>Error loading profile</div>;
  }

  // Add fade-in animation class when image loads
  return (
    <ImageLink
      href={resolvedHref}
      src={resolvedSrc}
      alt={resolvedAlt}
      size={size}
      className={`${className} hero-image--loaded`}
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
