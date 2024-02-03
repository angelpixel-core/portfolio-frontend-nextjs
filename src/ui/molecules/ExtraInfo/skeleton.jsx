import "./styles.css";

import { AnimatedNumberSkeleton } from "@/atoms/texts/_index";

export const ExtraInfoSkeleton = () => {
  return (
    <div className="extra-info_container">
      <span className="extra-info_number">
        <AnimatedNumberSkeleton />+
      </span>

      <h2 className="extra-info_title">subtitle</h2>
    </div>
  );
};
