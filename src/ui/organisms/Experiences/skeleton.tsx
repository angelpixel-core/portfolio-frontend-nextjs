import React from "react";

import { Skeleton as ExperienceSkeleton } from "@/molecules/Experience/skeleton";

export const Skeleton = (): React.JSX.Element => {
  return (
    <>
      <ExperienceSkeleton />
      <ExperienceSkeleton />
      <ExperienceSkeleton />
    </>
  );
};
