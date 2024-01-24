"use client";

import "./styles.css";

import { useSelector } from "react-redux";

import { Skill } from "@/molecules/about/_index";
import { SkillSelectorButton } from "@/atoms/buttons/_index";

export async function Skills({ items }) {
  const { skillLevel } = useSelector((state) => state.skill);

  const skillLevelFilter = (item) => {
    if ("www" === item.id) return;
    if ("default" === skillLevel || item.level === skillLevel) return item;
  };

  return (
    <div className="skills-container">
      <h2 className="skills-title">skills</h2>

      <div className="skills_selector">
        <SkillSelectorButton text="+ 5 años" level="senior" />
        <SkillSelectorButton text="< 3 años" level="middle" />
        <SkillSelectorButton text="< 1 año" level="junior" />
        <SkillSelectorButton text="Training" level="junior" />
      </div>

      <div className="skills-grid">
        <Skill
          key={0}
          name={items.find((item) => item.id === "www").id}
          level="default"
          whileHover={{ scale: 1.05, zIndex: 1 }}
          className="skills-skill-main skills-skill skill"
          initial={{ x: 0, y: 0 }}
        />

        {items.filter(skillLevelFilter).map((skill, index) => (
          <Skill
            key={index}
            name={skill.id}
            level={skill.level}
            whileHover={{ scale: 1.05, zIndex: 1 }}
            initial={{ x: 0, y: 0 }}
            whileInView={{
              x: skill.x,
              y: skill.y,
              transition: { duration: 1.5 },
            }}
            viewport={{ once: true }}
            className="skills-skill"
          />
        ))}
      </div>
    </div>
  );
}
