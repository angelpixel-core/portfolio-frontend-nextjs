import "./styles.css";

import { ParagraphSkeleton } from "@/atoms/texts/ParagraphText/skeleton";

export const BiographySkeleton = () => {
  return (
    <>
      <ParagraphSkeleton />
      <ParagraphSkeleton />
      <ParagraphSkeleton />
      <ParagraphSkeleton />
    </>
  );
};
