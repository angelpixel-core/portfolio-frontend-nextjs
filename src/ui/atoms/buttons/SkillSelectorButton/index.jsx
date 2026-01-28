"use client";

import "./styles.css";

import { useState, useCallback } from "react";

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
  const [isActive, setIsActive] = useState(false);

  const handleClick = useCallback(() => {
    const nextActive = !isActive;
    setIsActive(nextActive);

    const skills = document.querySelectorAll(`.skill_category--${category}`);
    skills.forEach((skill) => {
      const svgIcon = skill.querySelector("svg");
      const skillLabel = skill.querySelector("div.skill_category-label");

      if (!svgIcon || !skillLabel) return;

      if (nextActive) {
        svgIcon.classList.add(categoryHighlight[category].tailwind);
        skillLabel.classList.remove("hidden");
        skillLabel.style.zIndex = "-1";
      } else {
        svgIcon.classList.remove(categoryHighlight[category].tailwind);
        skillLabel.classList.add("hidden");
        skillLabel.style.zIndex = "0";
      }
    });
  }, [category, isActive]);

  return (
    <button
      type="button"
      className={`skills_selector-button${
        isActive ? " skills_selector-button--active" : ""
      }`}
      onClick={handleClick}
      aria-pressed={isActive}
      data-testid={`skill-selector-button-${category}`}
      data-category={category}
      data-active={isActive}
    >
      {text}
    </button>
  );
};

export default SkillSelectorButton;
