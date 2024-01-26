import "./styles.css";

import { SkillSelectorButton } from "@/atoms/buttons/_index";

export function SkillSelector() {
  return (
    <div id="skills_selector" className="skills_selector">
      <SkillSelectorButton category="senior" text="+ 5 años" />
      <SkillSelectorButton category="middle" text="< 3 años" />
      <SkillSelectorButton category="junior" text="< 1 año" />
      <SkillSelectorButton category="trainee" text="Training" />
      <SkillSelectorButton category="roadmap" text="RoadMap" />
    </div>
  );
}
