import "./styles.css";

import { HistorySkeleton } from "@/atoms/hocs/_index";
import { EducationSkeleton } from "@/molecules/_index";

export function AcademicsSkeleton() {
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
}
