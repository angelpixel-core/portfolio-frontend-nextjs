"use client";

import Experience from "@/molecules/about/experience";
import { useRef } from "react";
import { motion, useScroll } from "framer-motion";

export default function Experiences() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const title = "Experiences";
  const experiences = [
    {
      position: "Software Engineer",
      company: "Google",
      companyLink: "https://google.com",
      time: "2022-Present",
      address: "Mountain View, CA",
      work: "Worked on a team responsible for developing new features for Google's search engine, including improving the accuracy and relevance of search results and developing new tools for data analysis and visualization.",
    },

    {
      position: "Intern",
      company: "Facebook",
      companyLink: "https://facebook.com",
      time: "Summer 2021",
      address: "Menlo Park, CA",
      work: "Worked on a team responsible for developing a new mobile app feature that allowed users to create and share short-form video content, including designing and implementing a new user interface and developing the backend infrastructure to support the feature.",
    },

    {
      position: "Software Developer",
      company: "Amazon",
      companyLink: "https://amazon.com",
      time: "2020-2021",
      address: "Seattle, WA",
      work: "Worked on a team responsible for developing Amazon's mobile app, including implementing new features such as product recommendations and user reviews, and optimizing the app's performance and reliability.",
    },

    {
      position: "Software Developer Intern",
      company: "Microsoft",
      companyLink: "https://microsoft.com",
      time: "Summer 2019",
      address: "Redmond, WA",
      work: "Worked on a team responsible for developing new features for Microsoft's Windows operating system, including implementing a new user interface for a system settings panel and optimizing the performance of a core system component.",
    },

    {
      position: "Teaching Assistant",
      company: "MIT",
      companyLink: "https://mit.com",
      time: "Fall 2018",
      address: "Massachusetts Ave, Cambridge, MA",
      work: "Assisted in teaching a course on computer programming, held office hours to help students with assignments, and graded exams and assignments.",
    },
  ];

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
          {experiences.map((experience, index) => (
            <Experience
              key={index}
              position={experience.position}
              company={experience.company}
              companyLink={experience.companyLink}
              time={experience.time}
              address={experience.address}
              work={experience.work}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
