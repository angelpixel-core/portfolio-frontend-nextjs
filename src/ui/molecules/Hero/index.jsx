import "./styles.css";

import { Suspense } from "react";
import { ImageLinkSkeleton as HeroLinkSkeleton } from "@/atoms/links/ImageLink/skeleton";

import { Profile } from "@/models";
import { ImageLink } from "@/atoms/links";

const Hero = async ({ name, size, className }) => {
  const profile = await Profile.fetchBy({
    email: process.env.PROFILE_EMAIL,
  }).catch((error) => {
    console.error("❌ Error fetching profile:", error.message);

    return null;
  });

  if (!profile) return null;

  return (
    <Suspense
      fallback={<HeroLinkSkeleton className={`hero-image ${className}`} />}
    >
      <ImageLink
        href={profile.calendly}
        src={profile.images[name]}
        alt="hero"
        size={size}
        className={className}
      />
    </Suspense>
  );
};

export default Hero;
