"use client";

import "./styles.css";

import { motion } from "framer-motion";
import { Icon } from "./Icon";
import { useReducedMotion } from "@/hooks";

const Skill = ({
  name,
  category,
  initial,
  whileHover,
  whileInView = "",
  viewport = "",
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      data-category={category}
      className={`${className} skill skill_category--${category}`}
      initial={shouldReduceMotion ? undefined : initial}
      whileHover={shouldReduceMotion ? undefined : whileHover}
      whileInView={shouldReduceMotion ? undefined : whileInView}
      viewport={shouldReduceMotion ? undefined : viewport}
    >
      <Icon name={name} className="skill-icon z-10" />

      <div className="skill_category-label bg-light text-dark border-2 border-primary dark:border-primaryDark px-2 font-semibold capitalize rounded-lg hidden">
        {name}
      </div>
    </motion.div>
  );
};

export default Skill;
