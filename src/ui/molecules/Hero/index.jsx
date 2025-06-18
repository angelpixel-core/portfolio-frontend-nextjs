import "./styles.css";

import { Suspense } from "react";
import { ImageLinkSkeleton as HeroLinkSkeleton } from "@/atoms/links/ImageLink/skeleton";

import { Profile } from "@/models";
import { ImageLink } from "@/atoms/links";

export async function Hero({ name, size, className }) {
  const profile = await Profile.fetchBy({ email: process.env.PROFILE_EMAIL });

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
}
