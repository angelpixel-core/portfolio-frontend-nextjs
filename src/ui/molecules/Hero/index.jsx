import "./styles.css";

import { Suspense } from "react";
import { ImageLinkSkeleton as HeroLinkSkeleton } from "@/atoms/links/ImageLink/skeleton";

import { ImageLink } from "@/atoms/links";
import { useProfile } from "@domains/profile/queries";

const Hero = async ({ name, size, className }) => {
  const {
    data: profile,
    isLoading: isLoadingProfile,
    isError: isErrorProfile,
  } = useProfile();

  return (
    <Suspense
      fallback={<HeroLinkSkeleton className={`hero-image ${className}`} />}
    >
      <ImageLink
        href={data.calendly}
        src={data.avatar}
        alt={name}
        size={size}
        className={className}
      />
    </Suspense>
  );
};

export default Hero;
