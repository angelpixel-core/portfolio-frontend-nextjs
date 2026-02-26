"use client";

import React from "react";

import "./styles.css";

import type { Target, TargetAndTransition, VariantLabels } from "framer-motion";
import { m } from "framer-motion";
import { Icon } from "./Icon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

interface SkillProps {
  name: string;
  category: string;
  initial?: boolean | Target | VariantLabels;
  whileHover?: VariantLabels | TargetAndTransition;
  whileInView?: VariantLabels | TargetAndTransition;
  viewport?: { once?: boolean; amount?: number | "some" | "all" };
  className?: string;
}

const Skill = ({
  name,
  category,
  initial,
  whileHover,
  whileInView = "",
  viewport,
  className,
}: SkillProps): React.JSX.Element => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <m.div
      data-category={category}
      className={`${className} skill skill__category--${category}`}
      initial={shouldReduceMotion ? undefined : initial}
      whileHover={shouldReduceMotion ? undefined : whileHover}
      whileInView={shouldReduceMotion ? undefined : whileInView}
      viewport={shouldReduceMotion ? undefined : viewport}
    >
      <Icon name={name} className="skill-icon z-10" />

      <div className="skill__category-label bg-light text-dark border-2 border-primary dark:border-primaryDark px-2 font-semibold capitalize rounded-lg hidden">
        {name}
      </div>
    </m.div>
  );
};

export default Skill;
