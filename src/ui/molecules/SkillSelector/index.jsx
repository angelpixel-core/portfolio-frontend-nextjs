import "./styles.css";

import { SkillSelectorButton } from "@/atoms/buttons";

const SkillSelector = () => {
  return (
    <div
      id="skills_selector"
      className="skills_selector"
      data-testid="skill-selector"
    >
      <SkillSelectorButton category="senior" text="5 años" />
      <SkillSelectorButton category="middle" text="3 años" />
      <SkillSelectorButton category="junior" text="1 año" />
      <SkillSelectorButton category="trainee" text="Training" />
      <SkillSelectorButton category="roadmap" text="RoadMap" />
    </div>
  );
};

export default SkillSelector;
