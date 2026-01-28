import "./styles.css";
import { TransitionerLi } from "@/atoms/hocs";
import type { Academic } from "@/domains/academic";

/**
 * Education molecule - displays a single academic credential
 * Story 3.3: Academic Background
 * Story 3.4: Added verification link support
 */
type EducationProps = Academic;

const Education = ({
  degree,
  institution,
  start_date,
  end_date,
  resume,
  verification_url,
}: EducationProps) => {
  const time = `${start_date} - ${end_date}`;

  return (
    <TransitionerLi data={resume || ""}>
      <h3 className="education_title">{degree}</h3>
      <span className="education_history-info">
        {time} | {institution}
      </span>
      {verification_url && (
        <a
          href={verification_url}
          target="_blank"
          rel="noopener noreferrer"
          className="education_verification-link"
          aria-label={`Verify ${degree} credential`}
          data-testid="education-verification-link"
        >
          Verify credential
        </a>
      )}
    </TransitionerLi>
  );
};

export default Education;
