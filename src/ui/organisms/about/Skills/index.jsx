import "./styles.css";

import { Skill } from "@/molecules/about/_index";

export async function Skills({ items }) {
  return (
    <div className="skills-container">
      <h2 className="skills-title">skills</h2>

      <div className="skills-grid">
        <Skill
          key={0}
          name={items[0].name}
          whileHover={{ scale: 1.05 }}
          className="skills-skill--main"
        />

        {items.slice(1).map((skill, index) => (
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
        ))}
      </div>
    </div>
  );
}
