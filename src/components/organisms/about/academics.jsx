"use client";

import Education from "@/molecules/about/education";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

export default function Academics() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const title = "Education";
  const academics = [
    {
      type: " Bachelor Of Science In Computer Science",
      time: "2016-2020",
      place: "Massachusetts Institute Of Technology (MIT)",
      info: "Relevant courses included Data Structures and Algorithms, Computer Systems Engineering, and Artificial Intelligence.",
    },
    {
      type: "Master Of Computer Science",
      time: "2020-2022",
      place: "Stanford University",
      info: "Completed a master's project on deep learning, developing a new neural network architecture for natural language understanding.",
    },
    {
      type: "Online Coursework",
      time: "2016-2020",
      place: "Coursera And EdX",
      info: "Completed coursework in advanced topics such as Reinforcement Learning, Computer Vision, and Machine Learning Engineering.",
    },
  ];

  return (
    <div className="my-64">
      <h2
        className="
          font-bold
          w-full
          text-center
          mb-32 md:mb-16
          text-8xl md:text-6xl xs:text-4xl
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
            w-[4px] md:w-[2px]
            h-full
            left-9 md:left-[30px] xs:left-[20px]
            top-0
            origin-top
            bg-dark dark:bg-light
          "
        />

        <ul
          className="
            w-full
            flex flex-col items-start justify-between
            ml-4 xs:ml-2
          "
        >
          {academics.map((education, index) => (
            <Education
              key={index}
              type={education.type}
              time={education.time}
              place={education.place}
              info={education.info}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
