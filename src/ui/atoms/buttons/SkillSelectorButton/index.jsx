"use client";

import "./styles.css";

import { useState, useCallback } from "react";

/**
 * Category highlight class mapping
 * Used to add visual highlight to skill icons when category is active
 */
const categoryHighlight = {
  senior: "bg-light",
  middle: "bg-light",
  junior: "bg-light",
  trainee: "bg-light",
  roadmap: "bg-light",
};

const SkillSelectorButton = ({ category, text }) => {
  const [isActive, setIsActive] = useState(false);

  // TODO: [Tech Debt] This uses direct DOM manipulation instead of React state.
  // Ideally, active categories should be lifted to a shared context/parent,
  // and Skill components should receive highlight state via props.
  // Current approach works but bypasses React's reconciliation.
  const handleClick = useCallback(() => {
    const nextActive = !isActive;
    setIsActive(nextActive);

    const skills = document.querySelectorAll(`.skill_category--${category}`);
    skills.forEach((skill) => {
      const svgIcon = skill.querySelector("svg");
      const skillLabel = skill.querySelector("div.skill_category-label");

      if (!svgIcon || !skillLabel) return;

      if (nextActive) {
        svgIcon.classList.add(categoryHighlight[category]);
        skillLabel.classList.remove("hidden");
        skillLabel.style.zIndex = "-1";
      } else {
        svgIcon.classList.remove(categoryHighlight[category]);
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
