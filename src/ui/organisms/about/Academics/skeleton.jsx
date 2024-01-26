import "./styles.css";

import { HistorySkeleton } from "@/hoc/_index";
import { EducationSkeleton } from "@/molecules/about/_index";

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
