"use client";

import React, { useRef } from "react";

import "./styles.css";

import { m } from "framer-motion";

import LiIcon from "@/atoms/icons/LiIcon";
import { useReducedMotion } from "@/hooks/ui/useReducedMotion";

interface TransitionerLiProps {
  data: string;
  children: React.ReactNode;
}

const TransitionerLi = ({
  data,
  children,
}: TransitionerLiProps): React.JSX.Element => {
  const ref = useRef<HTMLLIElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <li ref={ref} className="transitioner-li">
      <LiIcon reference={ref} />

      <m.div
        initial={shouldReduceMotion ? { opacity: 1 } : { y: 50 }}
        whileInView={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.5, type: "spring" }
        }
      >
        {children}

        <p className="transitioner-li_legend">{data}</p>
      </m.div>
    </li>
  );
};

export default TransitionerLi;
