"use client";

import { ParagraphText } from "@/atoms/texts";
import { useContent } from "@/domains/content/queries";

const Text = ({ className }) => {
  const { data, isLoading, isError } = useContent(1);

  if (isLoading) {
    return <ParagraphText text="Loading..." className={className} />;
  }

  if (isError || !data) {
    return <ParagraphText text="Error loading content" className={className} />;
  }

  return <ParagraphText text={data.mainContent} className={className} />;
};

export default Text;
