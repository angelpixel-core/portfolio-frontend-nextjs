import "./styles.css";

import { TransitionerLi } from "@/hoc/_index";

export const Education = ({ props }) => {
  const { type, time, place, info } = props;

  return (
    <TransitionerLi data={info}>
      <h3 className="education_title">{type}&nbsp;</h3>

      <span className="education_history-info">
        {time} | {place}
      </span>
    </TransitionerLi>
  );
};
