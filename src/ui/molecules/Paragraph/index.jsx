import { default as Text } from "./Text";

import { Suspense } from "react";
import { ParagraphSkeleton } from "@/atoms/texts/Paragraph/skeleton";

const Paragraph = ({ className = "" }) => {
  return (
    <Suspense fallback={<ParagraphSkeleton />}>
      <Text className={className} />
    </Suspense>
  );
};

export default Paragraph;
