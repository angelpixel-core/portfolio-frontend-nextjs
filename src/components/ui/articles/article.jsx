"use client";

import { GithubIcon } from "@/components/ui/icons";
import { MovingImage } from "@/components/ui/moving-image";

import { motion } from "framer-motion";

export default function Article({ img, title, date, link }) {
  return (
    <motion.li
      initial={{ y: 200 }}
      whileInView={{ y: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
      viewport={{ once: true }}
      className="relative w-full p-4 py-6 my-4 rounded-xl flex items-center
      justify-between bg-light dark:bg-dark text-dark dark:text-light first:mt-0 border border-solid
      border-dark dark:border-light border-r-4 border-b-4"
    >
      <MovingImage title={title} img={img} link={link} />

      <span className="font-semibold pl-4 text-primary dark:text-primaryDark">
        {date}
      </span>
    </motion.li>
  );
}
