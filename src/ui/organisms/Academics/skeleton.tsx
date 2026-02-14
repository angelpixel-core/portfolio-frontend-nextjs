import "./styles.css";

import { HistorySkeleton } from "@/atoms/hocs/History/skeleton";
import { EducationSkeleton } from "@/molecules/Education/skeleton";

export const AcademicsSkeleton = () => {
  return (
    <div className="academics-container">
      <h2 className="academics-title">Education</h2>
      <HistorySkeleton>
        <EducationSkeleton />
        <EducationSkeleton />
        <EducationSkeleton />
      </HistorySkeleton>
    </div>
  );
};
