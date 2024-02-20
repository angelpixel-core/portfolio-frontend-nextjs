import { Text } from "./Text";

import { Suspense } from "react";
import { ParagraphSkeleton } from "@/atoms/texts/Paragraph/skeleton";

export function Paragraph({ className = "" }) {
  return (
    <Suspense fallback={<ParagraphSkeleton />}>
      <Text className={className} />
    </Suspense>
  );
}
