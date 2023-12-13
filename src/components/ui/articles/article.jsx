"use client";

import Link from "next/link";
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
      justify-between bg-light text-dark first:mt-0 border border-solid
      border-dark border-r-4 border-b-4"
    >
      <MovingImage title={title} img={img} link={link} />
      <span className="text-primary font-semibold pl-4">{date}</span>
    </motion.li>
  );
}
