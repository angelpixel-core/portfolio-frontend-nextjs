import React from "react";

import "./styles.css";

import { Skeleton as TransitionerLiSkeleton } from "@/atoms/hocs/TransitionerLi/skeleton";

export const Skeleton = (): React.JSX.Element => {
  return (
    <TransitionerLiSkeleton data="work">
      <h3 className="experience__title">
        position&nbsp;
        <a
          href="companyLink"
          target="_blank"
          className="experience__company-link"
        >
          @company
        </a>
      </h3>

      <span className="experience__history-info">time | address</span>
    </TransitionerLiSkeleton>
  );
};
