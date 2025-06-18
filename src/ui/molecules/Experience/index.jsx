import "./styles.css";

import { TransitionerLi } from "@/atoms/hocs";

export function Experience({
  position,
  company,
  companyLink,
  time,
  address,
  work,
}) {
  return (
    <TransitionerLi data={work}>
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
    </TransitionerLi>
  );
}
