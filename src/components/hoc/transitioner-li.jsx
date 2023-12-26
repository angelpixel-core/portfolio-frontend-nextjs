"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import LiIcon from "@/atoms/icons/li-icon";

export default function TransitionerLi({ data, children }) {
  const ref = useRef(null);

  return (
    <li
      ref={ref}
      className="
        flex flex-col items-center justify-between
        w-[60%] md:w-[80%]
        mx-auto my-8 first:mt-0 last:mb-0
      "
    >
      <LiIcon reference={ref} />

      <motion.div
        initial={{ y: 50 }}
        whileInView={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        {children}

        <p className="font-medium w-full md:text-sm">{data}</p>
      </motion.div>
    </li>
  );
}
