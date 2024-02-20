import "./styles.css";

import { Suspense } from "react";
import { SkillsListSkeleton } from "./skeleton";
import { SkillList } from "./SkillList";

export async function Skills() {
  return (
    <div className="skills-grid">
      <Suspense fallback={<SkillsListSkeleton />}>
        <SkillList />
      </Suspense>
    </div>
  );
}
