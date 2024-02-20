import { Button } from "./Button";

import { Suspense } from "react";
import Skeleton from "@/atoms/buttons/ArrowButton/skeleton";

export function Resume() {
  return (
    <Suspense callback={<Skeleton />}>
      <Button />
    </Suspense>
  );
}
