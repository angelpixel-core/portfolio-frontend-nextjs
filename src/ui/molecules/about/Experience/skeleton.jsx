import "./styles.css";

import { TransitionerLiSkeleton } from "@/hoc/_index";

export function ExperienceSkeleton() {
  const props = {
    position: "position",
    company: "company",
    companyLink: "companyLink",
    time: "time",
    address: "address",
    work: "work",
  };
  const { position, company, companyLink, time, address, work } = props;

  return (
    <TransitionerLiSkeleton data={work}>
      <h3 className="experience_title">
        {position}&nbsp;
        <a
          href={companyLink}
          target="_blank"
          className="experience_company-link"
        >
          @{company}
        </a>
      </h3>

      <span className="experience_history-info">
        {time} | {address}
      </span>
    </TransitionerLiSkeleton>
  );
}
