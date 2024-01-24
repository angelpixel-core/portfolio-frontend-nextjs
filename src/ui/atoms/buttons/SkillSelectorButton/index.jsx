"use client";

import "./styles.css";

import { useDispatch } from "react-redux";
import { setSkillLevel } from "@/slices/skill/skillSlice";

export const SkillSelectorButton = ({ text, level }) => {
  const dispatch = useDispatch();

  return (
    <button
      className="skills_selector-button"
      onClick={() => dispatch(setSkillLevel(level))}
    >
      {text}
    </button>
  );
};
