import React from "react";

interface SkillSkeletonProps {
  className?: string;
}

export function SkillSkeleton({
  className,
}: SkillSkeletonProps): React.JSX.Element {
  return (
    <div className={className}>
      <span className="block w-16 h-16" />
    </div>
  );
}
