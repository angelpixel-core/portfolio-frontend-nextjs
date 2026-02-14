"use client";

import React from "react";

import "./styles.css";

import { SkillsListSkeleton } from "./skeleton";
import Skill from "@/molecules/skill";
import { useTechnologies } from "@/domains/technology/queries";

const Skills = (): React.JSX.Element => {
  const { data: technologies = [], isLoading, isError } = useTechnologies();

  if (isLoading) {
    return (
      <div className="skills-grid" data-testid="skills-container-loading">
        <SkillsListSkeleton />
      </div>
    );
  }

  if (isError || !technologies.length) {
    return (
      <div className="skills-grid" data-testid="skills-container-fallback">
        <div className="skills_fallback">
          <p className="skills_fallback-text">Skills unavailable</p>
        </div>
      </div>
    );
  }

  // Find center skill without mutating original array
  const center = technologies.find((skill) => skill.name === "WWW");
  const skills = technologies.filter((skill) => skill.name !== "WWW");

  return (
    <div className="skills-grid" data-testid="skills-container">
      {center && (
        <Skill
          key={0}
          name={center.name}
          category="default"
          initial={{ x: 0, y: 0 }}
          whileHover={{ scale: 1.05, zIndex: 1 }}
          className="skills-skill skills-skill_center bg-light"
        />
      )}

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
