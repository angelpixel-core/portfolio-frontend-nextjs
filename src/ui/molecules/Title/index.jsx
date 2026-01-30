"use client";

import { Suspense } from "react";
import { AnimatedTitle } from "@/texts";
import { default as Skeleton } from "@/texts/AnimatedTitle/skeleton";

const Title = ({ className }) => {
  return (
    <div className="animated-title_container">
      <Suspense fallback={<Skeleton className={className} />}>
        <AnimatedTitle className={className} />
      </Suspense>
    </div>
  );
};

export default Title;
