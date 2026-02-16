"use client";

import React, { useState, useEffect } from "react";
import { ParagraphText } from "@/atoms/texts";
import { ParagraphSkeleton } from "@/atoms/texts/ParagraphText/skeleton";
import { useContent } from "@/domains/content/queries";

interface TextProps {
  className?: string;
}

const Text = ({ className }: TextProps): React.JSX.Element => {
  const { data, isLoading, isError } = useContent(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Trigger animation when content first loads
  useEffect(() => {
    if (data && !isLoading && !hasAnimated) {
      setIsAnimating(true);
      // Animation duration matches CSS (1.5s)
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setHasAnimated(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [data, isLoading, hasAnimated]);

  if (isLoading) {
    return <ParagraphSkeleton className={className} lines={5} />;
  }

  if (isError || !data) {
    return <ParagraphText text="Error loading content" className={className} />;
  }

  const animationClass = isAnimating ? "paragraph--typewriter-active" : "";

  return (
    <ParagraphText
      text={data.mainContent}
      className={`${className} paragraph--typewriter ${animationClass}`}
    />
  );
};

export default Text;
