import "./styles.css";
import { TransitionerLi } from "@/atoms/hocs";
import { EducationModel, EducationInfo } from "./../model/schema";

const infoToString = (info: EducationInfo[]): string =>
  info
    .map((data) => {
      const { topic, technologies, knowledge } = data;

      const technologiesStr = technologies.length > 0
        ? technologies.join(" | ")
        : "";

      const knowledgesStr = knowledge
        .map(({ paradigm, fundamentals }) => {
          if (!paradigm) return " | " + fundamentals.join(" | ");
          return fundamentals.length > 0
            ? `${paradigm}: ${fundamentals.join(" | ")}`
            : paradigm;
        })
        .join(". ");

      return [topic, technologiesStr, knowledgesStr]
        .filter(Boolean)
        .join(". ");
    })
    .join(". ");

interface EducationProps {
  props: EducationModel;
}

const Education = ({ props }: EducationProps) => {
  const { type, time, place, info } = props;
  const data = Array.isArray(info) ? infoToString(info) : info;

  return (
    <TransitionerLi data={data}>
      <h3 className="education_title">{type}&nbsp;</h3>
      <span className="education_history-info">
        {time} | {place}
      </span>
    </TransitionerLi>
  );
};

export default Education;
