import React from "react";
import { default as Skeleton } from "@/buttons/NavigationItemButton/skeleton";

const NavigationItemButtonsSkeleton = (): React.JSX.Element => {
  return (
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>
  );
};

export default NavigationItemButtonsSkeleton;
