"use client";

import React from "react";
import { useContent } from "@/domains/content/queries";

import { default as MotionTitle } from "./MotionTitle";
import Skeleton from "./skeleton";

interface TitleProps {
  className: string;
}

const Title = ({ className }: TitleProps): React.JSX.Element => {
  const {
    data: content,
    isLoading: isLoadingContent,
    isError: isErrorContent,
  } = useContent(1); // Pass ID directly, not as object

  // During loading: show skeleton with same className for consistent spacing
  if (isLoadingContent) {
    return <Skeleton className={className} />;
  }

  if (isErrorContent || !content) {
    return <MotionTitle title="Welcome" className={className} />;
  }

  return (
    <MotionTitle title={content.title || "Welcome"} className={className} />
  );
};

export default Title;
