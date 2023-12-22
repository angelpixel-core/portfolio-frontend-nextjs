"use client";

import EducationDetail from "./education-detail";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

export default function Education() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  return (
    <div className="my-64">
      <h2
        className="font-bold w-full text-center
        mb-32 md:mb-16
        text-8xl md:text-6xl xs:text-4xl"
      >
        Education
      </h2>

      <div
        ref={ref}
        className="relative mx-auto
        w-[75%] lg:w-[90%] md:w-full"
      >
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute w-[4px] h-full left-9 top-0 origin-top
          bg-dark dark:bg-light
          md:w-[2px] md:left-[30px] xs:left-[20px]"
        />

        <ul
          className="w-full flex flex-col items-start justify-between ml-4
          xs:ml-2"
        >
          <EducationDetail
            type=" Bachelor Of Science In Computer Science"
            time="2016-2020"
            place="Massachusetts Institute Of Technology (MIT)"
            info="Relevant courses included Data Structures and Algorithms,
            Computer Systems Engineering, and Artificial Intelligence."
          />

          <EducationDetail
            type="Master Of Computer Science"
            time="2020-2022"
            place="Stanford University"
            info="Completed a master's project on deep learning, developing a
            new neural network architecture for natural language understanding."
          />

          <EducationDetail
            type="Online Coursework"
            time="2016-2020"
            place="Coursera And EdX"
            info="Completed coursework in advanced topics such as Reinforcement
            Learning, Computer Vision, and Machine Learning Engineering."
          />
        </ul>
      </div>
    </div>
  );
}
