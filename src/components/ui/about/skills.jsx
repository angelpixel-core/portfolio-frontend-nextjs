"use client";

import { motion } from "framer-motion";

const Skill = ({ name, x, y }) => {
  return (
    <motion.div
      className="flex items-center justify-center rounded-full font-semibold
        bg-dark dark:bg-light text-light dark:text-dark py-3 px-6 shadow-dark 
        dark:shadow-light cursor-pointer absolute
        lg:py-2 lg:px-4 md:text-sm md:py-1.5 md:px-3
        xs:bg-transparent xs:dark:bg-transparent
        xs:text-dark xs:dark:text-light xs:font-bold"
      whileHover={{ scale: 1.05 }}
      initial={{ x: 0, y: 0 }}
      whileInView={{ x: x, y: y, transition: { duration: 1.5 } }}
      viewport={{ once: true }}
    >
      {name}
    </motion.div>
  );
};

export default function Skills() {
  return (
    <>
      <h2
        className="font-bold text-8xl mt-64 w-full text-center
        md:text-6xl md:mt-32"
      >
        Skills
      </h2>

      <div
        className="w-full relative flex items-center justify-center rounded-full
        h-screen lg:h-[80vh] sm:h-[60vh] xs:h-[50vh]
        bg-circularLight dark:bg-circularDark
        lg:bg-circurlarLightLg lg:dark:bg-circularDarkLg
        md:bg-circurlarLightMd md:dark:bg-circularDarkMd
        sm:bg-circurlarLightSm smm:dark:bg-circularDarkSm
         "
      >
        <motion.div
          className="flex items-center justify-center rounded-full
          cursor-pointer
          font-semibold
          text-light dark:text-dark dark:bg-light
          bg-dark dark:bg-light
          shadow-dark dark:shadow-light
          xs:text-xs
          p-8 lg:p-6 md:p-4 xs:p-2"
          whileHover={{ scale: 1.05 }}
        >
          Web
        </motion.div>

        <Skill name="HTML" x="-22vw" y="2vw" />
        <Skill name="CSS" x="-5vw" y="-10vw" />
        <Skill name="JavaScript" x="20vw" y="6vw" />
        <Skill name="TypeScript" x="0vw" y="12vw" />
        <Skill name="ReactJS" x="-20vw" y="-15vw" />
        <Skill name="NextJS" x="15vw" y="-12vw" />
        <Skill name="Web Design" x="32vw" y="-5vw" />
        <Skill name="Figma" x="0vw" y="-20vw" />
        <Skill name="Ruby" x="-18vw" y="14vw" />
        <Skill name="Ruby on Rails" x="18vw" y="18vw" />
        <Skill name="Tailwind CSS" x="-30vw" y="-4vw" />
      </div>
    </>
  );
}
