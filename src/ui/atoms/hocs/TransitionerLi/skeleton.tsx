import React from "react";

import "./styles.css";

import { Skeleton as LiIconSkeleton } from "@/atoms/icons/LiIcon/skeleton";

interface TransitionerLiSkeletonProps {
  data: string;
  children: React.ReactNode;
}

export const Skeleton = ({
  data,
  children,
}: TransitionerLiSkeletonProps): React.JSX.Element => {
  return (
    <li className="transitioner-li">
      <LiIconSkeleton />

      <div>
        {children}

        <p className="transitioner-li__legend">{data}</p>
      </div>
    </li>
  );
};
