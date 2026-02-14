import React from "react";
import { default as SocialNetworkLinkSkeleton } from "@/molecules/SocialNetworkLink/skeleton";

const Skeleton = (): React.JSX.Element => {
  return (
    <>
      <SocialNetworkLinkSkeleton />
      <SocialNetworkLinkSkeleton />
      <SocialNetworkLinkSkeleton />
      <SocialNetworkLinkSkeleton />
    </>
  );
};

export default Skeleton;
