"use client";

import "./styles.css";

const categoryHighlight = {
  senior: {
    tailwind: "bg-light",
    css: "#4d7c0f",
  },
  middle: {
    tailwind: "bg-light",
    css: "#06b6d4",
  },
  junior: {
    tailwind: "bg-light",
    css: "#d946ef",
  },
  trainee: {
    tailwind: "bg-light",
    css: "#f59e0b",
  },
  roadmap: {
    tailwind: "bg-light",
    css: "#ef4444",
  },
};

const SkillSelectorButton = ({ category, text }) => {
  const handleClick = (event) => {
    let button = event.target;
    const currentColor = !button.style.backgroundColor
      ? categoryHighlight[category].css
      : "";
    button.style.backgroundColor = currentColor;

    const zIndex = !button.style.backgroundColor ? "-1" : "0";

    const skills = document.querySelectorAll(`.skill_category--${category}`);
    skills.forEach((skill) => {
      const svgIcon = skill.querySelector("svg");
      svgIcon.classList.toggle(categoryHighlight[category].tailwind);

      const skillLabel = skill.querySelector("div.skill_category-label");
      skillLabel.classList.toggle("hidden");
      skillLabel.style.zIndex = zIndex;
    });
  };

  return (
    <button className="skills_selector-button" onClick={(e) => handleClick(e)}>
      {text}
    </button>
  );
};

export default SkillSelectorButton;
