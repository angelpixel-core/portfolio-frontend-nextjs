import "./styles.css";

import { SkillSkeleton } from "@/molecules/_index";

export function SkillsSkeleton() {
  return (
    <div className="skills-grid">
      <SkillSkeleton className="skills-skill-main skills-skill skill" />
    </div>
  );
}
