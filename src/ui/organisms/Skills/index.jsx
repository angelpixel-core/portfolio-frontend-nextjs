"use client";

import "./styles.css";

import { SkillsListSkeleton } from "./skeleton";
import { Skill } from "@/molecules";
import { useTechnologies } from "@/hooks";

const Skills = () => {
  const { data: technologies = [], isLoading, isError } = useTechnologies();

  if (isLoading) {
    return (
      <div className="skills-grid">
        <SkillsListSkeleton />
      </div>
    );
  }

  if (isError || !technologies.length) {
    return (
      <div className="skills-grid">
        <p>Unable to load skills.</p>
      </div>
    );
  }

  const centerIdx = technologies.findIndex((skill) => skill.name === "WWW");
  const center = technologies.splice(centerIdx, 1)[0];
  const skills = technologies;

  return (
    <div className="skills-grid">
      <Skill
        key={0}
        name={center.name}
        category="default"
        initial={{ x: 0, y: 0 }}
        whileHover={{ scale: 1.05, zIndex: 1 }}
        className="skills-skill skills-skill_center bg-light"
      />

      {skills.map(({ name, proficiency: category, x, y }, idx) => (
        <Skill
          key={idx}
          name={name}
          category={category}
          initial={{ x: 0, y: 0 }}
          whileHover={{ scale: 1.05, zIndex: 1 }}
          whileInView={{ x, y, transition: { duration: 1.5 } }}
          viewport={{ once: true }}
          className="skills-skill"
        />
      ))}
    </div>
  );
};

export default Skills;
