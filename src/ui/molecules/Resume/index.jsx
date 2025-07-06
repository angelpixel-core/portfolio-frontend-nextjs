import { Button } from "./Button";

import { Suspense } from "react";
import { default as Skeleton } from "@/buttons/ArrowButton/skeleton";

const Resume = () => {
  return (
    <Suspense callback={<Skeleton />}>
      <Button />
    </Suspense>
  );
};

export default Resume;
