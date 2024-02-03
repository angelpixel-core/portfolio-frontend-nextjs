import "./styles.css";

import { fetchSkills } from "@/lib/data/_index";

import { Skill } from "@/molecules/_index";

export async function Skills() {
  const skills = await fetchSkills({
    email: process.env.PROFILE_EMAIL,
  });

  const CenterSkill = () => (
    <Skill
      key={0}
      name={skills.find((skill) => skill.id === "www").id}
      category="default"
      initial={{ x: 0, y: 0 }}
      whileHover={{ scale: 1.05, zIndex: 1 }}
      className="skills-skill skills-skill_center bg-light"
    />
  );

  const OrbitSkills = () =>
    skills.map(({ id, category, x, y }, index) => (
      <Skill
        key={index}
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
    ));

  return (
    <div className="skills-grid">
      <CenterSkill />

      <OrbitSkills />
    </div>
  );
}
