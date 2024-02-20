import "./styles.css";

import { TechSkill } from "@/models/_index";
import { Skill } from "@/molecules/_index";

export async function SkillList() {
  const { center, skills } = await TechSkill.all().then((data) => {
    const centerIdx = data.findIndex((skill) => skill.id === "www");
    const center = data.splice(centerIdx, 1)[0];
    const skills = data;

    return { center, skills };
  });

  return (
    <>
      <Skill
        key={0}
        name={center.id}
        category="default"
        initial={{ x: 0, y: 0 }}
        whileHover={{ scale: 1.05, zIndex: 1 }}
        className="skills-skill skills-skill_center bg-light"
      />

      {skills.map(({ id, category, x, y }, idx) => (
        <Skill
          key={idx}
          name={id}
          category={category}
          initial={{ x: 0, y: 0 }}
          whileHover={{ scale: 1.05, zIndex: 1 }}
          whileInView={{
            x: x,
            y: y,
            transition: { duration: 1.5 },
          }}
          viewport={{ once: true }}
          className="skills-skill"
        />
      ))}
    </>
  );
}
