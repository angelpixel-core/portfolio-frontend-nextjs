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
      <h2 className="font-bold text-8xl mb-32 w-full text-center">Education</h2>

      <div ref={ref} className="w-[75%] mx-auto relative">
        <motion.div
          style={{ scaleY: scrollYProgress }}
          className="absolute left-9 top-0 w-[4px] h-full bg-dark dark:bg-light
          origin-top"
        />

        <ul className="w-full flex flex-col items-start justify-between ml-4">
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
