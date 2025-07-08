import { default as Text } from "./Text";

import { Suspense } from "react";
import { ParagraphTextSkeleton } from "@/atoms/texts/ParagraphText/skeleton";

const Paragraph = ({ className = "" }) => {
  return (
    <Suspense fallback={<ParagraphTextSkeleton />}>
      <Text className={className} />
    </Suspense>
  );
};

export default Paragraph;
