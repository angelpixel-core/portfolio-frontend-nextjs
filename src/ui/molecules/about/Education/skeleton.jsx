import "./styles.css";

import { TransitionerLiSkeleton } from "@/hoc/_index";

export function EducationSkeleton() {
  const props = { type: "type", time: "time", place: "place", info: "info" };
  const { type, time, place, info } = props;

  return (
    <TransitionerLiSkeleton data={info}>
      <h3 className="education_title">{type}&nbsp;</h3>

      <span className="education_history-info">
        {time} | {place}
      </span>
    </TransitionerLiSkeleton>
  );
}
