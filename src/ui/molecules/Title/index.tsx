"use client";

import React, { Suspense } from "react";
import AnimatedTitle from "@/texts/AnimatedTitle";
import { default as Skeleton } from "@/texts/AnimatedTitle/skeleton";

interface TitleProps {
  className?: string;
}

const Title = ({ className }: TitleProps): React.JSX.Element => {
  return (
    <div className="animated-title__container">
      <Suspense fallback={<Skeleton className={className} />}>
        <AnimatedTitle className={className} />
      </Suspense>
    </div>
  );
};

export default Title;
