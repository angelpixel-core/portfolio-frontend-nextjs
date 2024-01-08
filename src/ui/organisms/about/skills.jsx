import { fetchSkills } from "@/data/skills/_index";
import { Skill } from "@/molecules/about/_index";

export const Skills = async () => {
  const tittle = "Skills";
  const skills = await fetchSkills();

  return (
    <div className="skills-container">
      <h2 className="skills-title">{tittle}</h2>

      <div className="skills-grid">
        <Skill
          key={0}
          name={skills[0].name}
          whileHover={{ scale: 1.05 }}
          className="skills-skill--main"
        />

        {skills.map(
          (skill, index) =>
            index > 0 && (
              <Skill
                key={index}
                name={skill.name}
                whileHover={{ scale: 1.05 }}
                initial={{ x: 0, y: 0 }}
                whileInView={{
                  x: skill.x,
                  y: skill.y,
                  transition: { duration: 1.5 },
                }}
                viewport={{ once: true }}
                className="skills-skill"
              />
            ),
        )}
      </div>
    </div>
  );
};
