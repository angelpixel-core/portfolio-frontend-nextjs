import "./styles.css";

import { Suspense } from "react";
import { SkillsListSkeleton } from "./skeleton";

import { Skill } from "@/molecules/_index";
import { Technology } from "@/models/_index";

export async function Skills() {
  const { center, skills } = await Technology.all().then((data) => {
    const centerIdx = data.findIndex((skill) => skill.name === "WWW");
    const center = data.splice(centerIdx, 1)[0];
    const skills = data;

    return { center, skills };
  });

  return (
    <div className="skills-grid">
      <Suspense fallback={<SkillsListSkeleton />}>
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
      </Suspense>
    </div>
  );
}
