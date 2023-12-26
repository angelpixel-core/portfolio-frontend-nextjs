"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

export default function History({ title, children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <div className="my-64">
      <h2
        className="
          w-full
          mb-32 md:mb-16
          text-8xl md:text-6xl xs:text-4xl
          text-center
          font-bold
        "
      >
        {title}
      </h2>

      <div
        ref={ref}
        className="
          relative
          mx-auto
          w-[75%] lg:w-[90%] md:w-full
        "
      >
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="
            absolute
            w-[4px]  md:w-[2px] 
            h-full
            origin-top
            bg-dark dark:bg-light
            left-9 md:left-[30px] xs:left-[20px]
            top-0
          "
        />

        <ul
          className="
            w-full
            flex flex-col items-start justify-between
            ml-4 xs:ml-2
          "
        >
          {children}
        </ul>
      </div>
    </div>
  );
}
