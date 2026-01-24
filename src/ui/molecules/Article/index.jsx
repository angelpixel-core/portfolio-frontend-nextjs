"use client";

import "./styles.css";

import { motion } from "framer-motion";

import { MovingImage } from "@/ui/molecules";
import { useReducedMotion } from "@/hooks";

export const Article = ({ props }) => {
  const { img, title, date, link } = props;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.li
      initial={shouldReduceMotion ? { opacity: 1 } : { y: 200 }}
      whileInView={
        shouldReduceMotion
          ? { opacity: 1 }
          : { y: 0, transition: { duration: 0.5, ease: "easeInOut" } }
      }
      viewport={{ once: true }}
      className="article"
    >
      <MovingImage title={title} img={img} link={link} />

      <span className="article_publish-date">{date}</span>
    </motion.li>
  );
};
