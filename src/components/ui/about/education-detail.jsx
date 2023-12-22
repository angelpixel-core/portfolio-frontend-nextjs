"use client";

import LiIcon from "../li-icon";
import { useRef } from "react";
import { motion } from "framer-motion";

export default function EducationDetail({ type, time, place, info }) {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      className="flex flex-col items-center justify-between
      mx-auto my-8 first:mt-0 last:mb-0
      w-[60%] md:w-[80%]"
    >
      <LiIcon reference={ref} />
      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <h3
          className="capitalize font-bold
          text-2xl sm:text-xl xs:text-lg"
        >
          {type}&nbsp;
        </h3>

        <span
          className="capitalize font-medium
          text-dark/75 dark:text-light/75
          xs:text-sm"
        >
          {time} | {place}
        </span>
        <p className="font-medium w-full md:text-sm">{info}</p>
      </motion.div>
    </li>
  );
}
