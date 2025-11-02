"use client";

import { useContent } from "@/domains/content/queries";

import { default as MotionTitle } from "./MotionTitle";

const Title = async ({ className }) => {
  const {
    data: content,
    isLoading: isLoadingContent,
    isError: isErrorContent,
  } = useContent({ id: 1 });

  return <MotionTitle title={data.title} className={className} />;
};

export default Title;
