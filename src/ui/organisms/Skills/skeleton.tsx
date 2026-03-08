import React from "react";

export const SkillsListSkeleton = (): React.JSX.Element => {
  return (
    <div className="skills-skeleton" role="status" aria-label="Loading skills">
      <span className="skills-skeleton__node skills-skeleton__node--center" />
      <span className="skills-skeleton__node skills-skeleton__node--n1" />
      <span className="skills-skeleton__node skills-skeleton__node--n2" />
      <span className="skills-skeleton__node skills-skeleton__node--n3" />
      <span className="skills-skeleton__node skills-skeleton__node--n4" />
      <span className="skills-skeleton__node skills-skeleton__node--n5" />
      <span className="skills-skeleton__node skills-skeleton__node--n6" />
    </div>
  );
};
