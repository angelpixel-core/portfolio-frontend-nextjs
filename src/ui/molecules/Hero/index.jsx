import "./styles.css";

import { Suspense } from "react";
import { ImageLinkSkeleton as HeroLinkSkeleton } from "@/atoms/links/ImageLink/skeleton";

import { ImageLink } from "@/atoms/links";
// import { Profile } from "@/models";

const Hero = async ({ name, size, className }) => {
  // const profile = await Profile.findBy({ id: 1 });
  const data = await fetch("http://localhost:8000/api/v1/site/profiles/1").then(
    (res) => res.json()
  );

  return (
    <Suspense
      fallback={<HeroLinkSkeleton className={`hero-image ${className}`} />}
    >
      <ImageLink
        href={data.calendly}
        src={data.images[name]}
        alt="hero"
        size={size}
        className={className}
      />
    </Suspense>
  );
};

export default Hero;
