"use client";

import "./styles.css";

import { TransitionerLi } from "@/atoms/hocs";
import type { JobExperience } from "@/domains/job-experience";

type ExperienceProps = Pick<
  JobExperience,
  "position" | "company" | "companyLink" | "time" | "address" | "work"
>;

const Experience = ({
  position,
  company,
  companyLink,
  time,
  address,
  work,
}: ExperienceProps) => {
  // Format work items as text for display
  const workSummary = work?.map((item) => item.description).join(" ");

  return (
    <TransitionerLi data={workSummary}>
      <h3 className="experience_title">
        {position}&nbsp;
        <a
          href={companyLink}
          target="_blank"
          rel="noopener noreferrer"
          className="experience_company-link"
        >
          @{company}
        </a>
      </h3>

      <span className="experience_history-info">
        {time} | {address}
      </span>
    </TransitionerLi>
  );
};

export default Experience;
