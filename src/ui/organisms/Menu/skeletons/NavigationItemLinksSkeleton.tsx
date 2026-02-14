import React from "react";
import { default as NavigationItemLinkSkeleton } from "@/links/NavigationItemLink/skeleton";

const Skeleton = (): React.JSX.Element => {
  return (
    <>
      <NavigationItemLinkSkeleton width="3.2rem" />
      <NavigationItemLinkSkeleton width="3.5rem" />
      <NavigationItemLinkSkeleton width="5rem" />
      <NavigationItemLinkSkeleton width="5rem" />
    </>
  );
};

export default Skeleton;
