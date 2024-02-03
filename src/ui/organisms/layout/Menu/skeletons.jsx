import FeatureLinkSkeleton from "@/atoms/links/FeatureLink/skeleton";
import SocialLinkSkeleton from "@/atoms/links/SocialLink/skeleton";

export function FeatureLinksSkeleton() {
  return (
    <>
      <FeatureLinkSkeleton />
      <FeatureLinkSkeleton />
      <FeatureLinkSkeleton />
    </>
  );
}

export function SocialLinksSkeleton() {
  return (
    <>
      <SocialLinkSkeleton />
      <SocialLinkSkeleton />
      <SocialLinkSkeleton />
    </>
  );
}
