"use client";

import "./styles.css";

import { motion } from "framer-motion";

import { GithubIcon } from "@/atoms/icons/_index";
import { MovingImage } from "@/molecules/layout/_index";

export const Article = ({ props }) => {
  const { img, title, date, link } = props;

  return (
    <motion.li
      initial={{ y: 200 }}
      whileInView={{ y: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      viewport={{ once: true }}
      className="article"
    >
      <MovingImage title={title} img={img} link={link} />

      <span className="article_publish-date">{date}</span>
    </motion.li>
  );
};
