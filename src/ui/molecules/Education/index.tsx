import "./styles.css";
import { TransitionerLi } from "@/atoms/hocs";
import type { Academic } from "@/domains/academic";

/**
 * Education molecule - displays a single academic credential
 * Story 3.3: Academic Background
 */
type EducationProps = Academic;

const Education = ({
  degree,
  institution,
  start_date,
  end_date,
  resume,
}: EducationProps) => {
  const time = `${start_date} - ${end_date}`;

  return (
    <TransitionerLi data={resume || ""}>
      <h3 className="education_title">{degree}</h3>
      <span className="education_history-info">
        {time} | {institution}
      </span>
    </TransitionerLi>
  );
};

export default Education;
