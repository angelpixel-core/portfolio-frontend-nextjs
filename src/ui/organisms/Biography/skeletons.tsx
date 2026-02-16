import React from "react";

import "./styles.css";

import { ParagraphSkeleton } from "@/atoms/texts/ParagraphText/skeleton";

export const BiographySkeleton = (): React.JSX.Element => {
  return (
    <>
      <ParagraphSkeleton />
      <ParagraphSkeleton />
      <ParagraphSkeleton />
      <ParagraphSkeleton />
    </>
  );
};
