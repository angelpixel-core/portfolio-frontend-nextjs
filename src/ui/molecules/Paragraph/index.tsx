import React, { Suspense } from "react";
import { default as Text } from "./Text";
import { ParagraphSkeleton } from "@/atoms/texts/ParagraphText/skeleton";

interface ParagraphProps {
  className?: string;
}

const Paragraph = ({ className = "" }: ParagraphProps): React.JSX.Element => {
  return (
    <Suspense fallback={<ParagraphSkeleton className={className} />}>
      <Text className={className} />
    </Suspense>
  );
};

export default Paragraph;
