// TODO: check it out
// src/ui/organisms/MenuFloating/skeletons/FeatureLinksSkeleton.jsx"

import { default as SocialLinkSkeleton } from "@/molecules/SocialLink/Skeleton";

const Skeleton = () => {
  return (
    <>
      <SocialLinkSkeleton />
      <SocialLinkSkeleton />
      <SocialLinkSkeleton />
    </>
  );
};

export default Skeleton;
