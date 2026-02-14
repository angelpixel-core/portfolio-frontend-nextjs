import React from "react";

import "./styles.css";

import { Skeleton } from "@/atoms/hocs/TransitionerLi/skeleton";

export const EducationSkeleton = (): React.JSX.Element => {
  const props: Record<string, string> = { type: "type", time: "time", place: "place", info: "info" };
  const { type, time, place, info } = props;

  return (
    <Skeleton data={info}>
      <h3 className="education_title">{type}&nbsp;</h3>

      <span className="education_history-info">
        {time} | {place}
      </span>
    </Skeleton>
  );
};
