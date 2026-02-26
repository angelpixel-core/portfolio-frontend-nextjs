import React from "react";

import "./styles.css";

import { SkillSelectorButton } from "@/atoms/buttons";

const SkillSelector = (): React.JSX.Element => {
  return (
    <div
      id="skills__selector"
      className="skills__selector"
      data-testid="skill-selector"
    >
      <SkillSelectorButton category="senior" text="5 años" />
      <SkillSelectorButton category="middle" text="3 años" />
      <SkillSelectorButton category="junior" text="1 año" />
      <SkillSelectorButton category="trainee" text="Training" />
      <SkillSelectorButton category="roadmap" text="Roadmap" />
    </div>
  );
};

export default SkillSelector;
