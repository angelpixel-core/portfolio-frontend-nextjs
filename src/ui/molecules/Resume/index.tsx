import { Suspense } from "react";

import Button from "./Button";
import Skeleton from "@/buttons/ArrowButton/skeleton";

const Resume = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      <Button />
    </Suspense>
  );
};

export default Resume;
