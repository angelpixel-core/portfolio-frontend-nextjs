"use client";

import GithubIcon from "@/atoms/icons/github-icon";
import MovingImage from "@/molecules/layout/moving-image";

import { motion } from "framer-motion";

export default function Article({ img, title, date, link }) {
  return (
    <motion.li
      initial={{ y: 200 }}
      whileInView={{ y: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      viewport={{ once: true }}
      className="relative
      flex sm:flex-col
      items-center justify-between
      w-full
      p-4 py-6
      my-4 first:mt-0
      rounded-xl
      bg-light dark:bg-dark text-dark dark:text-light
      border border-solid border-dark dark:border-light border-r-4 border-b-4"
    >
      <MovingImage title={title} img={img} link={link} />

      <span
        className="font-semibold
        sm:self-start
        pl-4 sm:pl-0
        xs:text-sm
        text-primary dark:text-primaryDark"
      >
        {date}
      </span>
    </motion.li>
  );
}
