import { default as Text } from "./Text";

import { Suspense } from "react";
import { ParagraphSkeleton } from "@/atoms/texts/ParagraphText/skeleton";

const Paragraph = ({ className = "" }) => {
  return (
    <Suspense fallback={<ParagraphSkeleton className={className} />}>
      <Text className={className} />
    </Suspense>
  );
};

export default Paragraph;
