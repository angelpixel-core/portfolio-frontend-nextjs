import "./styles.css";

import { Suspense } from "react";
import { ImageLinkSkeleton as HeroLinkSkeleton } from "@/atoms/links/ImageLink/skeleton";
import { HeroLink } from "./link";

export function Hero({ size, className }) {
  return (
    <Suspense
      fallback={<HeroLinkSkeleton className={`hero-image ${className}`} />}
    >
      <HeroLink size={size} className={`hero-image ${className}`} />
    </Suspense>
  );
}
