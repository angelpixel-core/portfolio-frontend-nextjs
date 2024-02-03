import "./styles.css";

import { TransitionerLi } from "@/atoms/hocs/_index";

const infoToString = (info) =>
  info
    .map((data) => {
      const topic = data.topic;

      let technologies = "";
      if (data.technologies.length > 0) {
        technologies = data.technologies.join(" | ");
      }

      const knowledges = data.knowledge
        .map(({ paradigm, fundamentals }) => {
          if (!paradigm) {
            return " | " + fundamentals.join(" | ");
          } else {
            if (fundamentals.length > 0) {
              return paradigm + ": " + fundamentals.join(" | ");
            } else {
              return paradigm;
            }
          }
        })
        .join(". ");

      let result = [topic];
      if (technologies) result.push(technologies);
      if (knowledges) result.push(knowledges);

      return result.join(". ");
    })
    .join(". ");

export function Education({ props }) {
  const { type, time, place, info } = props;

  let data = info;
  if (Array.isArray(info)) data = infoToString(info);

  return (
    <TransitionerLi data={data}>
      <h3 className="education_title">{type}&nbsp;</h3>

      <span className="education_history-info">
        {time} | {place}
      </span>
    </TransitionerLi>
  );
}
