"use client";

import "./styles.css";

import { useRef } from "react";
import { motion } from "framer-motion";

import LiIcon from "@/atoms/icons/LiIcon";
import { useReducedMotion } from "@/hooks";

const TransitionerLi = ({ data, children }) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <li ref={ref} className="transitioner-li">
      <LiIcon reference={ref} />

      <motion.div
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
      </motion.div>
    </li>
  );
};

export default TransitionerLi;
