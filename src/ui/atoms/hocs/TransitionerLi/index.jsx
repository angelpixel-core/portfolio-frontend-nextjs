"use client";

import "./styles.css";

import { useRef } from "react";
import { motion } from "framer-motion";

import { LiIcon } from "@/atoms/icons";

export function TransitionerLi({ data, children }) {
  const ref = useRef(null);

  return (
    <li ref={ref} className="transitioner-li">
      <LiIcon reference={ref} />

      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {children}

        <p className="transitioner-li_legend">{data}</p>
      </motion.div>
    </li>
  );
}
