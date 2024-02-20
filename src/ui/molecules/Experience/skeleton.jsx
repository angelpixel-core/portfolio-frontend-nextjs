import "./styles.css";

import TransitionerLiSkeleton from "@/atoms/hocs/TransitionerLi/skeleton";

export default function Skeleton() {
  return (
    <TransitionerLiSkeleton data="work">
      <h3 className="experience_title">
        position&nbsp;
        <a
          href="companyLink"
          target="_blank"
          className="experience_company-link"
        >
          @company
        </a>
      </h3>

      <span className="experience_history-info">time | address</span>
    </TransitionerLiSkeleton>
  );
}
