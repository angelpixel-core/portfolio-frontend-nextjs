import "./styles.css";

import { Suspense } from "react";
import { BiographyTextSkeleton } from "./skeleton";
import { BiographyText } from "./text";

export function Biography() {
  return (
    <>
      <h2 className="biography-title">biography</h2>

      <Suspense fallback={<BiographyTextSkeleton />}>
        <BiographyText />
      </Suspense>
    </>
  );
}
