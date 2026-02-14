import React, { Suspense } from "react";

import Button from "./Button";
import Skeleton from "@/buttons/ArrowButton/skeleton";

const Resume = (): React.JSX.Element => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Button />
    </Suspense>
  );
};

export default Resume;
