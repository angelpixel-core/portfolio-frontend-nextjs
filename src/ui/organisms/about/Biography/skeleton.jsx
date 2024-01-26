import "./styles.css";

import { ParagraphSkeleton } from "@/atoms/texts/_index";

export function BiographySkeleton() {
  return (
    <>
      <h2 className="biography-title">biography</h2>
      <ParagraphSkeleton />
    </>
  );
}
