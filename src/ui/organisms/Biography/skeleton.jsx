import "./styles.css";

import { ParagraphSkeleton } from "@/atoms/texts/Paragraph/skeleton";

export function BiographyTextSkeleton() {
  return (
    <>
      <ParagraphSkeleton />
      <ParagraphSkeleton />
      <ParagraphSkeleton />
      <ParagraphSkeleton />
    </>
  );
}
